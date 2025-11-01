package com.tnntruong.quiznote.controller;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.domain.Comment;
import com.tnntruong.quiznote.dto.request.ReqCreateCommentDTO;
import com.tnntruong.quiznote.dto.response.ResCommentDTO;
import com.tnntruong.quiznote.service.CommentService;
import com.tnntruong.quiznote.util.error.InvalidException;
import com.turkraft.springfilter.boot.Filter;

@RestController
@RequestMapping("/api/v1/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/{subjectId}")
    public ResponseEntity<?> createComment(@PathVariable Long subjectId,
            @RequestBody ReqCreateCommentDTO comment) throws InvalidException {
        Comment saved = commentService.addComment(subjectId, comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ResCommentDTO(saved));
    }

    @PostMapping("/reply/{parentId}")
    public ResponseEntity<?> replyToComment(@PathVariable Long parentId,
            @RequestBody ReqCreateCommentDTO request) throws InvalidException {
        Comment reply = commentService.replyToComment(parentId, request);
        return ResponseEntity.ok(new ResCommentDTO(reply));
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<?> getComments(@PathVariable Long subjectId, @Filter Specification<Comment> spec,
            Pageable page) throws InvalidException {
        return ResponseEntity.ok(commentService.getCommentsBySubject(subjectId, spec, page));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) throws InvalidException {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok("Comment deleted successfully");
    }
}
