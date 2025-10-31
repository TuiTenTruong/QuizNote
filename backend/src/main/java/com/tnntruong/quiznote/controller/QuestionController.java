package com.tnntruong.quiznote.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.dto.request.ReqCreateQuestionDTO;
import com.tnntruong.quiznote.dto.request.ReqUpdateQuestionDTO;
import com.tnntruong.quiznote.service.QuestionService;
import com.tnntruong.quiznote.util.error.InvalidException;

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
    public ResponseEntity<?> getQuestionBySubjectId(@PathVariable String subjectId) throws InvalidException {
        return ResponseEntity.ok(this.questionService.handleGetQuestionBySubjectId(subjectId));
    }

    @GetMapping("/questions/chapter/{chapterId}")
    public ResponseEntity<?> getQuestionByChapterId(@PathVariable String chapterId) throws InvalidException {
        return ResponseEntity.ok(this.questionService.handleGetQuestionByChapterId(chapterId));
    }
}
