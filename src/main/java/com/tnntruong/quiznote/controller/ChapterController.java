package com.tnntruong.quiznote.controller;

import org.springframework.web.bind.annotation.RestController;
import com.tnntruong.quiznote.service.ChapterService;
import com.tnntruong.quiznote.service.request.ReqCreateChapterDTO;
import com.tnntruong.quiznote.service.request.ReqUpdateChapterDTO;
import com.tnntruong.quiznote.util.annotation.ApiMessage;
import com.tnntruong.quiznote.util.error.InvalidException;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/v1")
public class ChapterController {

    private ChapterService chapterService;

    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }

    @PostMapping("/chapters")
    public ResponseEntity<?> createChapter(@Valid @RequestBody ReqCreateChapterDTO chapterDTO) throws InvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.chapterService.handleCreateChapter(chapterDTO));
    }

    @PutMapping("/chapters")
    public ResponseEntity<?> updateChapter(@RequestBody ReqUpdateChapterDTO chapterDTO) throws InvalidException {
        return ResponseEntity.ok(this.chapterService.handleUpdateChapter(chapterDTO));
    }

    @GetMapping("/chapters/subject/{subjectId}")
    public ResponseEntity<?> getChapterBySubjectId(@PathVariable String subjectId) throws InvalidException {
        return ResponseEntity.ok(this.chapterService.hanldeGetChapterBySubjectId(subjectId));
    }

    @DeleteMapping("/chapters/{id}")
    @ApiMessage("delete chapter")
    public ResponseEntity<?> deleteChapterById(@PathVariable String id) throws InvalidException {
        this.chapterService.handleDeleteChapter(id);
        return ResponseEntity.ok("deleted chapter");
    }
}
