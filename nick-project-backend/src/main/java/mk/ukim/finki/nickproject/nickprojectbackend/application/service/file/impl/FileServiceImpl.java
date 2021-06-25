package mk.ukim.finki.nickproject.nickprojectbackend.application.service.file.impl;

import mk.ukim.finki.nickproject.nickprojectbackend.application.service.file.FileService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Base64;

@Service
public class FileServiceImpl implements FileService {
    private final Path root;

    public FileServiceImpl() {
        this.root = Paths.get("uploads");
        try {
            if (!Files.exists(this.root)) {
                Files.createDirectory(this.root);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public byte[] loadFile(String filename) {
        Path filePath = this.root.resolve(filename);
        try {
            return Base64.getEncoder().encode(Files.newInputStream(filePath).readAllBytes());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void saveFile(String filename, MultipartFile file) {
        Path filePath = this.root.resolve(filename);
        try {
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteFile(String filename) {
        Path filePath = this.root.resolve(filename);
        try {
            Files.delete(filePath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
