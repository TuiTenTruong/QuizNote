package com.tnntruong.quiznote.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.domain.Question;
import com.tnntruong.quiznote.dto.request.ReqCreateQuestionDTO;
import com.tnntruong.quiznote.dto.request.ReqUpdateQuestionDTO;
import com.tnntruong.quiznote.service.QuestionService;
import com.tnntruong.quiznote.util.error.InvalidException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1")
public class QuestionController {
    private QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping("/questions")
    public ResponseEntity<?> createQuestion(@Valid @RequestBody ReqCreateQuestionDTO questionDTO)
            throws InvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.questionService.hanleCreateQuestion(questionDTO));
    }

    // tạo câu hỏi bằng 1 mảng ReqCreateQuestionDTO
    @PostMapping("/questions/batch")
    public ResponseEntity<?> createQuestions(@Valid @RequestBody ReqCreateQuestionDTO[] questionDTOs)
            throws InvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.questionService.handleCreateQuestions(questionDTOs));
    }

    @PutMapping("/questions")
    public ResponseEntity<?> updateQuestion(@Valid @RequestBody ReqUpdateQuestionDTO questionDTO)
            throws InvalidException {
        return ResponseEntity.ok(this.questionService.handleUpdateQuestion(questionDTO));
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
