package mk.ukim.finki.nickproject.nickprojectbackend.application.service.file;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {

    byte[] loadFile(String filename);

    void saveFile(String filename, MultipartFile file);

    void deleteFile(String filename);

}
