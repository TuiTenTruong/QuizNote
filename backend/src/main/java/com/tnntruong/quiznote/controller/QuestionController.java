package com.tnntruong.quiznote.controller;

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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tnntruong.quiznote.domain.Question;
import com.tnntruong.quiznote.dto.request.ReqCreateQuestionDTO;
import com.tnntruong.quiznote.dto.request.ReqUpdateQuestionDTO;
import com.tnntruong.quiznote.service.FileService;
import com.tnntruong.quiznote.service.QuestionService;
import com.tnntruong.quiznote.util.error.InvalidException;
import com.tnntruong.quiznote.util.error.StorageException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1")
public class QuestionController {
    private QuestionService questionService;
    private FileService fileService;
    @Value("${quiznote.upload-file.base-uri}")
    private String baseURI;

    public QuestionController(QuestionService questionService, FileService fileService) {
        this.questionService = questionService;
        this.fileService = fileService;
    }

    @PostMapping(value = "/questions", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createQuestion(@Valid @RequestPart("question") ReqCreateQuestionDTO questionDTO,
            @RequestPart(name = "image", required = false) MultipartFile image)
            throws InvalidException, URISyntaxException, IOException, StorageException {

        String stored = null;
        if (image != null) {
            String fileName = image.getOriginalFilename();
            List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png");
            boolean isValid = allowedExtensions.stream().anyMatch(item -> fileName.toLowerCase().endsWith(item));

            if (!isValid) {
                throw new StorageException("File không hợp lệ. Chỉ cho phép " + allowedExtensions.toString());
            }
            this.fileService.createDirectory(baseURI + "questions");
            stored = this.fileService.store(image, "questions");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(this.questionService.handleCreateQuestion(questionDTO, stored));
    }

    // tạo câu hỏi bằng 1 mảng ReqCreateQuestionDTO
    @PostMapping(value = "/questions/batch", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createQuestions(
            @Valid @RequestPart("questions") ReqCreateQuestionDTO[] questionDTOs,
            @RequestPart(name = "images", required = false) MultipartFile[] images)
            throws InvalidException, URISyntaxException, IOException, StorageException {

        String[] storedFiles = null;
        if (images != null && images.length > 0) {
            this.fileService.createDirectory(baseURI + "questions");
            storedFiles = new String[images.length];
            for (int i = 0; i < images.length; i++) {
                if (images[i] != null && !images[i].isEmpty()) {
                    String fileName = images[i].getOriginalFilename();
                    List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png");
                    boolean isValid = allowedExtensions.stream()
                            .anyMatch(item -> fileName.toLowerCase().endsWith(item));

                    if (!isValid) {
                        throw new StorageException("File không hợp lệ. Chỉ cho phép " + allowedExtensions.toString());
                    }
                    storedFiles[i] = this.fileService.store(images[i], "questions");
                }
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(this.questionService.handleCreateQuestions(questionDTOs, storedFiles));
    }

    @PutMapping(value = "/questions", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> updateQuestion(@Valid @RequestPart("question") ReqUpdateQuestionDTO questionDTO,
            @RequestPart(name = "image", required = false) MultipartFile image)
            throws InvalidException, URISyntaxException, IOException, StorageException {
        String stored = null;
        if (image != null) {
            String fileName = image.getOriginalFilename();
            List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png");
            boolean isValid = allowedExtensions.stream().anyMatch(item -> fileName.toLowerCase().endsWith(item));

            if (!isValid) {
                throw new StorageException("File không hợp lệ. Chỉ cho phép " + allowedExtensions.toString());
            }
            this.fileService.createDirectory(baseURI + "questions");
            stored = this.fileService.store(image, "questions");
        }
        return ResponseEntity.ok(this.questionService.handleUpdateQuestion(questionDTO, stored));
    }

    @GetMapping("/questions/{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable String id) throws InvalidException {
        return ResponseEntity.ok(this.questionService.handleGetQuestionById(id));
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<?> deleteQuestionById(@PathVariable String id) throws InvalidException {
        this.questionService.handleDeleteQuestionById(id);
        return ResponseEntity.ok("deleted question");
    }

    @GetMapping("/questions/subject/{subjectId}")
    public ResponseEntity<?> getQuestionBySubjectId(@PathVariable String subjectId,
            @Filter Specification<Question> spec,
            Pageable page) throws InvalidException {
        return ResponseEntity.ok(this.questionService.handleGetQuestionBySubjectId(subjectId, spec, page));
    }

    @GetMapping("/questions/subject/{subjectId}/random")
    public ResponseEntity<?> getRandomQuestionBySubjectId(@PathVariable String subjectId,
            @Filter Specification<Question> spec,
            Pageable page) throws InvalidException {
        return ResponseEntity.ok(this.questionService.handleGetRandomQuestionBySubjectId(subjectId, spec, page));
    }

    @GetMapping("/questions/chapter/{chapterId}")
    public ResponseEntity<?> getQuestionByChapterId(@PathVariable String chapterId) throws InvalidException {
        return ResponseEntity.ok(this.questionService.handleGetQuestionByChapterId(chapterId));
    }
}
