package com.linkedin.backend.features.authentication.service;

import com.linkedin.backend.features.authentication.dto.AuthenticationRequestBody;
import com.linkedin.backend.features.authentication.dto.AuthenticationResponseBody;
import com.linkedin.backend.features.authentication.model.User;
import com.linkedin.backend.features.authentication.repository.UserRepository;
import com.linkedin.backend.features.authentication.utils.EmailService;
import com.linkedin.backend.features.authentication.utils.Encoder;
import com.linkedin.backend.features.authentication.utils.JsonWebToken;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AuthenticationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private final UserRepository userRepository;
    private final int durationInMinutes = 10; // Increased from 1 to 10 minutes

    private final Encoder encoder;
    private final JsonWebToken jsonWebToken;
    private final EmailService emailService;

    @PersistenceContext
    private EntityManager entityManager;

    public AuthenticationService(UserRepository userRepository, Encoder encoder,
                                 JsonWebToken jsonWebToken, EmailService emailService) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jsonWebToken = jsonWebToken;
        this.emailService = emailService;
    }

    public static String generateEmailVerificationToken() {
        SecureRandom random = new SecureRandom();
        StringBuilder token = new StringBuilder(5);
        for (int i = 0; i < 5; i++) {
            token.append(random.nextInt(10));
        }
        return token.toString();
    }

    public void sendEmailVerificationToken(String email) {
        logger.info("Sending email verification token to: {}", email);

        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && !user.get().getEmailVerified()) {
            String emailVerificationToken = generateEmailVerificationToken();
            String hashedToken = encoder.encode(emailVerificationToken);
            user.get().setEmailVerificationToken(hashedToken);
            user.get().setEmailVerificationTokenExpiryDate(LocalDateTime.now().plusMinutes(durationInMinutes));
            userRepository.save(user.get());
            String subject = "Email Verification";
            String body = String.format("Only one step to take full advantage of LinkedIn.\n\n"
                            + "Enter this code to verify your email: " + "%s\n\n" + "The code will expire in " + "%s"
                            + " minutes.",
                    emailVerificationToken, durationInMinutes);
            try {
                logger.info("Attempting to send verification email to: {} with token: {}", email, emailVerificationToken);
                emailService.sendEmail(email, subject, body);
                logger.info("Verification email sent successfully to: {}", email);
            } catch (Exception e) {
                logger.error("Error while sending verification email to {}: {}", email, e.getMessage(), e);
                throw new RuntimeException("Failed to send verification email. Please try again later.", e);
            }
        } else {
            logger.warn("Email verification token request failed for {}: user not found or already verified", email);
            throw new IllegalArgumentException("Email verification token failed, or email is already verified.");
        }
    }

    public void validateEmailVerificationToken(String token, String email) {
        logger.info("Validating email verification token for: {}", email);

        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && encoder.matches(token, user.get().getEmailVerificationToken())
                && !user.get().getEmailVerificationTokenExpiryDate().isBefore(LocalDateTime.now())) {
            user.get().setEmailVerified(true);
            user.get().setEmailVerificationToken(null);
            user.get().setEmailVerificationTokenExpiryDate(null);
            userRepository.save(user.get());
            logger.info("Email verified successfully for: {}", email);
        } else if (user.isPresent() && encoder.matches(token, user.get().getEmailVerificationToken())
                && user.get().getEmailVerificationTokenExpiryDate().isBefore(LocalDateTime.now())) {
            logger.warn("Email verification token expired for: {}", email);
            throw new IllegalArgumentException("Email verification token expired.");
        } else {
            logger.warn("Email verification token validation failed for: {}", email);
            throw new IllegalArgumentException("Email verification token failed.");
        }
    }

    public AuthenticationResponseBody login(AuthenticationRequestBody loginRequestBody) {
        logger.info("Login attempt for: {}", loginRequestBody.getEmail());

        User user = userRepository.findByEmail(loginRequestBody.getEmail())
                .orElseThrow(() -> {
                    logger.warn("Login failed: User not found for email: {}", loginRequestBody.getEmail());
                    return new IllegalArgumentException("User not found.");
                });

        if (!encoder.matches(loginRequestBody.getPassword(), user.getPassword())) {
            logger.warn("Login failed: Incorrect password for user: {}", loginRequestBody.getEmail());
            throw new IllegalArgumentException("Password is incorrect.");
        }

        String token = jsonWebToken.generateToken(loginRequestBody.getEmail());
        logger.info("Login successful for: {}", loginRequestBody.getEmail());
        return new AuthenticationResponseBody(token, "Authentication succeeded.");
    }

    public AuthenticationResponseBody register(AuthenticationRequestBody registerRequestBody) {
        logger.info("Registration attempt for: {}", registerRequestBody.getEmail());

        User user = userRepository.save(new User(
                registerRequestBody.getEmail(), encoder.encode(registerRequestBody.getPassword())));

        String emailVerificationToken = generateEmailVerificationToken();
        String hashedToken = encoder.encode(emailVerificationToken);
        user.setEmailVerificationToken(hashedToken);
        user.setEmailVerificationTokenExpiryDate(LocalDateTime.now().plusMinutes(durationInMinutes));

        userRepository.save(user);

        String subject = "Email Verification";
        String body = String.format("""
                        Only one step to take full advantage of LinkedIn.
                        
                        Enter this code to verify your email: %s. The code will expire in %s minutes.""",
                emailVerificationToken, durationInMinutes);
        try {
            logger.info("Sending registration verification email to: {} with token: {}", registerRequestBody.getEmail(), emailVerificationToken);
            emailService.sendEmail(registerRequestBody.getEmail(), subject, body);
            logger.info("Registration verification email sent successfully to: {}", registerRequestBody.getEmail());
        } catch (Exception e) {
            logger.error("Error while sending registration email to {}: {}", registerRequestBody.getEmail(), e.getMessage(), e);
            // Continue with registration even if email fails
        }
        String authToken = jsonWebToken.generateToken(registerRequestBody.getEmail());
        logger.info("Registration successful for: {}", registerRequestBody.getEmail());
        return new AuthenticationResponseBody(authToken, "User registered successfully.");
    }

    public User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = entityManager.find(User.class, userId);
        if (user != null) {
            entityManager.createNativeQuery("DELETE FROM posts_likes WHERE user_id = :userId")
                    .setParameter("userId", userId)
                    .executeUpdate();
            entityManager.remove(user);
        }
    }

    public void sendPasswordResetToken(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            String passwordResetToken = generateEmailVerificationToken();
            String hashedToken = encoder.encode(passwordResetToken);
            user.get().setPasswordResetToken(hashedToken);
            user.get().setPasswordResetTokenExpiryDate(LocalDateTime.now().plusMinutes(durationInMinutes));
            userRepository.save(user.get());
            String subject = "Password Reset";
            String body = String.format("""
                            You requested a password reset.
                            
                            Enter this code to reset your password: %s. The code will expire in %s minutes.""",
                    passwordResetToken, durationInMinutes);
            try {
                emailService.sendEmail(email, subject, body);
            } catch (Exception e) {
                logger.info("Error while sending email: {}", e.getMessage());
            }
        } else {
            throw new IllegalArgumentException("User not found.");
        }
    }

    public void resetPassword(String email, String newPassword, String token) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && encoder.matches(token, user.get().getPasswordResetToken())
                && !user.get().getPasswordResetTokenExpiryDate().isBefore(LocalDateTime.now())) {
            user.get().setPasswordResetToken(null);
            user.get().setPasswordResetTokenExpiryDate(null);
            user.get().setPassword(encoder.encode(newPassword));
            userRepository.save(user.get());
        } else if (user.isPresent() && encoder.matches(token, user.get().getPasswordResetToken())
                && user.get().getPasswordResetTokenExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Password reset token expired.");
        } else {
            throw new IllegalArgumentException("Password reset token failed.");
        }
    }

    public User updateUserProfile(Long userId, String firstName, String lastName, String company,
                                  String position, String location, String profilePicture, String coverPicture, String about) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (firstName != null)
            user.setFirstName(firstName);
        if (lastName != null)
            user.setLastName(lastName);
        if (company != null)
            user.setCompany(company);
        if (position != null)
            user.setPosition(position);
        if (location != null)
            user.setLocation(location);
        if (profilePicture != null)
            user.setProfilePicture(profilePicture);
        if (coverPicture != null)
            user.setCoverPicture(coverPicture);
        if (about != null)
            user.setAbout(about);

        return userRepository.save(user);
    }

    public List<User> getUsersWithoutAuthenticated(User user) {
        return userRepository.findAllByIdNot(user.getId());
    }

    public User getUserById(Long receiverId) {
        return userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }
}
