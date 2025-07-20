package com.linkedin.backend.features.upload.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class UploadService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Value("${server.port:8089}")
    private String serverPort;

    public String storeFile(MultipartFile file, Long userId) {
        try {
            // Create the upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate a unique file name
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID().toString() + fileExtension;

            // Create user directory
            Path userDir = uploadPath.resolve(userId.toString());
            if (!Files.exists(userDir)) {
                Files.createDirectories(userDir);
            }

            // Save the file
            Path targetLocation = userDir.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return the URL to access the file
            return "http://localhost:" + serverPort + "/uploads/" + userId + "/" + fileName;

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file. Please try again!", ex);
        }
    }
}
