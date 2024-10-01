package com.backend.utility;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

@Component
public class StorageServiceImpl implements StorageService {

    @Value("${disk.upload.basepath}")
    private String basePath;

    // Load all files in the directory
    @Override
    public List<String> loadAll() {
        File directory = new File(basePath);
        if (!directory.exists()) {
            directory.mkdirs(); // Ensure directory exists
        }
        String[] fileList = directory.list();
        return fileList != null ? Arrays.asList(fileList) : List.of();
    }

    // Store the uploaded file and return the new file name
    @Override
    public String store(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("Filename is missing");
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        List<String> allowedExtensions = Arrays.asList(".jpg", ".png", ".jpeg", ".gif");

        if (!allowedExtensions.contains(extension.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file type");
        }

        String fileName = UUID.randomUUID().toString().replace("-", "") + extension;
        File targetFile = new File(basePath, fileName);

        try {
            System.out.println("Saving file to: " + targetFile.getAbsolutePath()); // Debugging line
            try (FileOutputStream out = new FileOutputStream(targetFile)) {
                FileCopyUtils.copy(file.getInputStream(), out);
                return fileName;
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    // Load a file by its name
    @Override
    public Resource load(String fileName) {
        File file = new File(basePath, fileName);
        return file.exists() ? new FileSystemResource(file) : null;
    }

    // Delete a file by its name
    @Override
    public void delete(String fileName) {
        File file = new File(basePath, fileName);
        if (file.exists()) {
            if (file.delete()) {
                System.out.println("File deleted successfully: " + fileName);
            } else {
                System.out.println("Failed to delete file: " + fileName);
            }
        } else {
            System.out.println("File not found: " + fileName);
        }
    }
}
