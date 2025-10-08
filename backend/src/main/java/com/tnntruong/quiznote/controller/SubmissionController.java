package com.tnntruong.quiznote.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.service.SubmissionService;
import com.tnntruong.quiznote.service.request.ReqStartSubmissionDTO;
import com.tnntruong.quiznote.service.request.ReqSubmitAnswerDTO;
import com.tnntruong.quiznote.util.error.InvalidException;

@RestController
@RequestMapping("/api/v1")
public class SubmissionController {
    private SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @PostMapping("/submissions/start")
    public ResponseEntity<?> startSubmission(@RequestBody ReqStartSubmissionDTO dto) throws InvalidException {
        return ResponseEntity.ok(this.submissionService.handleStartSubmission(dto));
    }

    @PostMapping("/submissons/{submissionId}/submit")
    public ResponseEntity<?> submitSubmisison(@PathVariable Long submissionId,
            @RequestBody List<ReqSubmitAnswerDTO> answers) throws InvalidException {
        return ResponseEntity.ok(this.submissionService.handleStartSubmission(submissionId, answers));
    }
}
