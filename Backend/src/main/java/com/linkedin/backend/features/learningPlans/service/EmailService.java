package com.linkedin.backend.features.learningPlans.service;

import com.linkedin.backend.features.learningPlans.model.Milestone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service("authenticationEmailService")
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    private static final String EMAIL="ckariyawasam2023@gmail.com";
    public void sendReminder(Milestone milestone){
        SimpleMailMessage message=new SimpleMailMessage();
//        message.setTo(milestone.getUser().getEmail());
        message.setTo(EMAIL);
        message.setSubject("Reminder"+milestone.getName()+"is due soon");
        message.setText("hi there ,Just  a reminder"+milestone.getName() +"is due on" +milestone.getDeadline());
        mailSender.send(message);
    }
}
