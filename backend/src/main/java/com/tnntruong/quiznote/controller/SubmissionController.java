package com.tnntruong.quiznote.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.dto.request.ReqStartSubmissionDTO;
import com.tnntruong.quiznote.dto.request.ReqSubmitAnswerDTO;
import com.tnntruong.quiznote.service.SubmissionService;
import com.tnntruong.quiznote.util.annotation.ApiMessage;
import com.tnntruong.quiznote.util.error.InvalidException;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/v1/submissions")
public class SubmissionController {
    private SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping("/start")
    @ApiMessage("Start a new submission")
    public ResponseEntity<?> startSubmission(@Valid @RequestBody ReqStartSubmissionDTO dto) throws InvalidException {
        // Optional: verify current user matches dto.getUserId()
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(this.submissionService.handleStartSubmission(dto));
    }

    @PostMapping("/{submissionId}/submit")
    @ApiMessage("Submit answers for submission")
    public ResponseEntity<?> submitSubmission(@PathVariable Long submissionId,
            @Valid @RequestBody List<ReqSubmitAnswerDTO> answers) throws InvalidException {

        if (answers == null || answers.isEmpty()) {
            throw new InvalidException("Answers list cannot be empty");
        }

        return ResponseEntity.ok(this.submissionService.handleSubmission(submissionId, answers));
    }

    @GetMapping("/stats/subject/{subjectId}/highest-score")
    @ApiMessage("Get highest score for a subject")
    public ResponseEntity<?> getSubjectHighestScore(@PathVariable Long subjectId) throws InvalidException {
        Double highestScore = this.submissionService.getHighestScoreForSubject(subjectId);
        return ResponseEntity.ok(highestScore != null ? highestScore : 0.0);
    }

    @GetMapping("/history/user/{userId}")
    public ResponseEntity<?> getUserSubmissionHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(this.submissionService.getUserSubmissionHistory(userId));
    }

}
