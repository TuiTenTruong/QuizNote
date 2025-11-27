package com.tnntruong.quiznote.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tnntruong.quiznote.domain.Subject;
import com.tnntruong.quiznote.service.FileService;
import com.tnntruong.quiznote.service.SubjectService;
import com.tnntruong.quiznote.util.error.InvalidException;
import com.tnntruong.quiznote.util.error.StorageException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1")
public class SubjectController {
    @Value("${quiznote.upload-file.base-uri}")
    private String baseURI;
    private SubjectService subjectService;
    private FileService fileService;

    public SubjectController(SubjectService subjectService, FileService fileService) {
        this.subjectService = subjectService;
        this.fileService = fileService;
    }

    @PostMapping(value = "/subjects", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    // create subject with image
    public ResponseEntity<?> createSubject(@Valid @RequestPart("subject") Subject subject,
            @RequestPart(name = "image", required = false) MultipartFile image)
            throws InvalidException, URISyntaxException, IOException, StorageException {
        String stored = null;
        if (image != null) {
            String fileName = image.getOriginalFilename();
            List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png");
            boolean isValid = allowedExtensions.stream().anyMatch(item -> fileName.toLowerCase().endsWith(item));

            if (!isValid) {
                throw new StorageException("File không hợp lệ. Chỉ cho phép  " + allowedExtensions.toString());
            }

            this.fileService.createDirectory(baseURI + "subjects");
            stored = this.fileService.store(image, "subjects");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(this.subjectService.handleCreateSubject(subject, stored));
    }

    @PostMapping(value = "/subjects/draft", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    // create subject with image
    public ResponseEntity<?> saveDraftSubject(@Valid @RequestPart("subject") Subject subject,
            @RequestPart(name = "image", required = false) MultipartFile image)
            throws InvalidException, URISyntaxException, IOException, StorageException {
        if (image != null) {
            String fileName = image.getOriginalFilename();
            List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png");
            boolean isValid = allowedExtensions.stream().anyMatch(item -> fileName.toLowerCase().endsWith(item));

            if (!isValid) {
                throw new StorageException("File không hợp lệ. Chỉ cho phép  " + allowedExtensions.toString());
            }
            this.fileService.createDirectory(baseURI + "subjects");
            String stored = this.fileService.store(image, "subjects");
            subject.setImageUrl(stored);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(this.subjectService.handleCreateDraftSubject(subject));
    }

    @PutMapping(value = "/subjects", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> updateSubject(@Valid @RequestPart("subject") Subject subject,
            @RequestPart(name = "image", required = false) MultipartFile image)
            throws InvalidException, URISyntaxException, IOException, StorageException {
        String stored = null;
        if (image != null) {
            String fileName = image.getOriginalFilename();
            List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png");
            boolean isValid = allowedExtensions.stream().anyMatch(item -> fileName.toLowerCase().endsWith(item));

            if (!isValid) {
                throw new StorageException("File không hợp lệ. Chỉ cho phép  " + allowedExtensions.toString());
            }
            this.fileService.createDirectory(baseURI + "subjects");
            stored = this.fileService.store(image, "subjects");
        }
        return ResponseEntity.ok(this.subjectService.handleUpdateSubject(subject, stored));
    }

    @DeleteMapping("/subjects/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable long id) throws InvalidException {
        this.subjectService.handleDeleteSubject(id);
        return ResponseEntity.ok("deleted subject");
    }

    @GetMapping("/subjects/{id}")
    public ResponseEntity<?> getSubjectById(@PathVariable long id) throws InvalidException {
        return ResponseEntity.ok().body(this.subjectService.handleGetSubjectById(id));
    }

    @GetMapping("/subjects/my/{subjectId}")
    public ResponseEntity<?> getSubjectByIdAndSeller(@PathVariable long subjectId) throws InvalidException {
        return ResponseEntity.ok().body(this.subjectService.handleGetSubjectByIdAndSeller(subjectId));
    }

    @GetMapping("/subjects")
    public ResponseEntity<?> getALlSubject(@Filter Specification<Subject> spec, Pageable page) {
        return ResponseEntity.ok().body(this.subjectService.handleGetAllSubject(spec, page));
    }

    @GetMapping("/subjects/seller/{sellerId}")
    public ResponseEntity<?> getSubjectBySellerId(@PathVariable long sellerId,
            @Filter Specification<Subject> spec,
            Pageable page) {
        return ResponseEntity.ok().body(this.subjectService.handleGetSubjectBySellerId(sellerId, spec, page));
    }

    @PutMapping("/subjects/{subjectId}/approve")
    public ResponseEntity<?> approveSubject(@PathVariable long subjectId) throws InvalidException {
        return ResponseEntity.ok().body(this.subjectService.handleApproveSubject(subjectId));
    }

    @PutMapping("/subjects/{subjectId}/reject")
    public ResponseEntity<?> rejectSubject(@PathVariable long subjectId) throws InvalidException {
        return ResponseEntity.ok().body(this.subjectService.handleRejectSubject(subjectId));
    }

    @GetMapping("/subjects/demo")
    public ResponseEntity<?> getDemoSubject() {
        return ResponseEntity.ok().body(this.subjectService.getDemoSubject());
    }

}
