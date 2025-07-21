package com.linkedin.backend.features.upload.controller;

import com.linkedin.backend.features.authentication.model.User;
import com.linkedin.backend.features.upload.service.UploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/upload")
public class UploadController {

    private final UploadService uploadService;

    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestAttribute("authenticatedUser") User user) {

        String fileUrl = uploadService.storeFile(file, user.getId());
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }
}
