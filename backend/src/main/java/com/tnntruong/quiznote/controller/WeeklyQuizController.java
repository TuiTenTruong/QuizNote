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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tnntruong.quiznote.domain.WeeklyQuiz;
import com.tnntruong.quiznote.dto.request.ReqWeeklyQuizDTO;
import com.tnntruong.quiznote.dto.request.ReqWeeklyQuizSubmitDTO;
import com.tnntruong.quiznote.service.FileService;
import com.tnntruong.quiznote.service.WeeklyQuizService;
import com.tnntruong.quiznote.util.annotation.ApiMessage;
import com.tnntruong.quiznote.util.error.InvalidException;
import com.tnntruong.quiznote.util.error.StorageException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class WeeklyQuizController {
    private final WeeklyQuizService weeklyQuizService;
    private final FileService fileService;

    @Value("${quiznote.upload-file.base-uri}")
    private String baseURI;

    public WeeklyQuizController(WeeklyQuizService weeklyQuizService, FileService fileService) {
        this.weeklyQuizService = weeklyQuizService;
        this.fileService = fileService;
    }

    @PostMapping(value = "/admin/weekly-quizzes", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @ApiMessage("Tạo weekly quiz thành công")
    public ResponseEntity<?> createWeeklyQuiz(@Valid @RequestPart("weeklyQuiz") ReqWeeklyQuizDTO reqDTO,
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
        return ResponseEntity.status(HttpStatus.CREATED).body(weeklyQuizService.createWeeklyQuiz(reqDTO, storedFiles));
    }

    @PutMapping(value = "/admin/weekly-quizzes/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @ApiMessage("Cập nhật weekly quiz thành công")
    public ResponseEntity<?> updateWeeklyQuiz(
            @PathVariable long id,
            @Valid @RequestPart("weeklyQuiz") ReqWeeklyQuizDTO reqDTO,
            @RequestPart(name = "images", required = false) MultipartFile[] images)
            throws InvalidException, URISyntaxException, IOException {
        String[] storedFiles = null;
        if (images != null && images.length > 0) {
            this.fileService.createDirectory(baseURI + "questions");
            storedFiles = new String[images.length];
            for (int i = 0; i < images.length; i++) {
                if (images[i] != null && !images[i].isEmpty()) {
                    storedFiles[i] = this.fileService.store(images[i], "questions");
                }
            }
        }
        return ResponseEntity.ok(weeklyQuizService.updateWeeklyQuiz(id, reqDTO, storedFiles));
    }

    @DeleteMapping("/admin/weekly-quizzes/{id}")
    @ApiMessage("Xóa weekly quiz thành công")
    public ResponseEntity<?> deleteWeeklyQuiz(@PathVariable long id) throws InvalidException {
        weeklyQuizService.deleteWeeklyQuiz(id);
        return ResponseEntity.ok(null);
    }

    @GetMapping("/admin/weekly-quizzes")
    @ApiMessage("Lấy danh sách weekly quiz thành công")
    public ResponseEntity<?> getAllWeeklyQuizzes(
            @Filter Specification<WeeklyQuiz> spec,
            Pageable pageable) {
        return ResponseEntity.ok(weeklyQuizService.getAllWeeklyQuizzes(spec, pageable));
    }

    @GetMapping("/admin/weekly-quizzes/{id}")
    @ApiMessage("Lấy chi tiết weekly quiz thành công")
    public ResponseEntity<?> getWeeklyQuizById(@PathVariable long id) throws InvalidException {
        return ResponseEntity.ok(weeklyQuizService.getWeeklyQuizById(id));
    }

    // Student APIs
    @GetMapping("/weekly-quiz/current")
    @ApiMessage("Lấy weekly quiz hiện tại thành công")
    public ResponseEntity<?> getCurrentWeeklyQuiz() throws InvalidException {
        return ResponseEntity.ok(weeklyQuizService.getCurrentWeeklyQuiz());
    }

    @GetMapping("/weekly-quiz/{id}/status")
    @ApiMessage("Lấy trạng thái weekly quiz thành công")
    public ResponseEntity<?> getWeeklyQuizStatus(@PathVariable long id) throws InvalidException {
        return ResponseEntity.ok(weeklyQuizService.getWeeklyQuizStatus(id));
    }

    @PostMapping("/weekly-quiz/submit")
    @ApiMessage("Nộp bài weekly quiz thành công")
    public ResponseEntity<?> submitWeeklyQuiz(@Valid @RequestBody ReqWeeklyQuizSubmitDTO reqDTO)
            throws InvalidException {
        return ResponseEntity.ok(weeklyQuizService.submitWeeklyQuiz(reqDTO));
    }
}
