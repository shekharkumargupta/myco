package com.myco.users.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("v1/files")
public class FileUploadController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Create directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Normalize file name
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());

            // Save file to the target location
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok("File uploaded successfully: " + fileName);

        } catch (IOException ex) {
            return ResponseEntity.status(500).body("Could not upload the file: " + ex.getMessage());
        }
    }
}
