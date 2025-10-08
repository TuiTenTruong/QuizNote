package com.tnntruong.quiznote.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.domain.Subject;
import com.tnntruong.quiznote.service.SubjectService;
import com.tnntruong.quiznote.util.error.InvalidException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1")
public class SubjectController {

    private SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping("/subjects")
    public ResponseEntity<?> createSubject(@Valid @RequestBody Subject subject) throws InvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.subjectService.handleCreateSubject(subject));
    }

    @PutMapping("/subjects")
    public ResponseEntity<?> updateSubject(@RequestBody Subject subject) throws InvalidException {
        return ResponseEntity.ok(this.subjectService.handleUpdateSubject(subject));
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

    @GetMapping("/subjects")
    public ResponseEntity<?> getALlSubject(@Filter Specification<Subject> spec, Pageable page) {
        return ResponseEntity.ok().body(this.subjectService.handleGetAllSubject(spec, page));
    }

}
