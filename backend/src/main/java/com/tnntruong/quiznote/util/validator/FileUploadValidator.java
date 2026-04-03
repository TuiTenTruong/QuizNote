package com.tnntruong.quiznote.util.validator;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.tnntruong.quiznote.service.FileService;
import com.tnntruong.quiznote.util.error.StorageException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class FileUploadValidator {

    @Value("${quiznote.upload-file.base-uri}")
    private String baseURI;

    private final FileService fileService;

    private static final Set<String> IMAGE_EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif", "webp");
    private static final Set<String> DOCUMENT_EXTENSIONS = Set.of("pdf", "doc", "docx", "xls", "xlsx");
    // Giới hạn kích thước file (bytes)
    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final long MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

    public FileUploadValidator(FileService fileService) {
        this.fileService = fileService;
    }

    public void validateImage(MultipartFile file) throws StorageException {
        validateFile(file, IMAGE_EXTENSIONS, MAX_IMAGE_SIZE, "ảnh");
    }

    public void validateDocument(MultipartFile file) throws StorageException {
        validateFile(file, DOCUMENT_EXTENSIONS, MAX_DOCUMENT_SIZE, "tài liệu");
    }

    public void validateFile(MultipartFile file, Set<String> allowedExtensions) throws StorageException {
        validateFile(file, allowedExtensions, MAX_IMAGE_SIZE, "file");
    }

    public String validateAndStoreImage(MultipartFile file, String folder)
            throws StorageException, URISyntaxException, IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        validateImage(file);
        return storeFile(file, folder);
    }

    public String validateAndStore(MultipartFile file, String folder, Set<String> allowedExtensions)
            throws StorageException, URISyntaxException, IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        validateFile(file, allowedExtensions, MAX_IMAGE_SIZE, "file");
        return storeFile(file, folder);
    }

    public String validateAndStore(MultipartFile file, String folder)
            throws StorageException, URISyntaxException, IOException {
        return validateAndStoreImage(file, folder);
    }

    // ==================== PRIVATE METHODS ====================

    private void validateFile(MultipartFile file, Set<String> allowedExtensions, long maxSize, String fileType)
            throws StorageException {

        if (file == null || file.isEmpty()) {
            throw new StorageException("File không được để trống");
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isBlank()) {
            throw new StorageException("Tên file không hợp lệ");
        }

        // Validate extension
        String extension = getFileExtension(fileName);
        if (extension.isEmpty() || !allowedExtensions.contains(extension.toLowerCase())) {
            throw new StorageException(
                    String.format("File %s không hợp lệ. Chỉ cho phép: %s", fileType, allowedExtensions));
        }

        // Validate file size
        if (file.getSize() > maxSize) {
            throw new StorageException(
                    String.format("File %s vượt quá kích thước cho phép (%d MB)",
                            fileType, maxSize / (1024 * 1024)));
        }

        // Validate content type (MIME type)
        String contentType = file.getContentType();
        if (contentType == null || !isValidContentType(contentType, allowedExtensions)) {
            log.warn("Content type không khớp với extension: {} vs {}", contentType, extension);
            // Chỉ cảnh báo, không reject để tránh false positive
        }

        log.debug("File validated successfully: {}, size: {} bytes", fileName, file.getSize());
    }

    private String storeFile(MultipartFile file, String folder)
            throws URISyntaxException, IOException {
        fileService.createDirectory(baseURI + folder);
        String storedFileName = fileService.store(file, folder);
        log.info("File stored successfully: {} in folder: {}", storedFileName, folder);
        return storedFileName;
    }

    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == fileName.length() - 1) {
            return "";
        }
        return fileName.substring(lastDotIndex + 1).toLowerCase();
    }

    private boolean isValidContentType(String contentType, Set<String> allowedExtensions) {
        if (allowedExtensions.equals(IMAGE_EXTENSIONS)) {
            return contentType.startsWith("image/");
        }
        if (allowedExtensions.equals(DOCUMENT_EXTENSIONS)) {
            return contentType.startsWith("application/") || contentType.equals("application/pdf");
        }
        return true; // Mặc định cho phép nếu không xác định được
    }

    // ==================== STATIC UTILITY METHODS ====================

    /**
     * Lấy set extension cho ảnh (có thể dùng cho custom validation)
     */
    public static Set<String> getImageExtensions() {
        return IMAGE_EXTENSIONS;
    }

    /**
     * Lấy set extension cho tài liệu
     */
    public static Set<String> getDocumentExtensions() {
        return DOCUMENT_EXTENSIONS;
    }
}
