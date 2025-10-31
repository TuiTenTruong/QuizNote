package com.tnntruong.quiznote.dto.response;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import com.tnntruong.quiznote.domain.Comment;

import lombok.Data;

@Data
public class ResCommentDTO {
    private Long id;
    private String content;
    private int rating;
    private String userEmail;
    private String subjectName;
    private Instant createdAt;
    private List<ResCommentDTO> replies;

    public ResCommentDTO(Comment c) {
        this.id = c.getId();
        this.content = c.getContent();
        this.rating = c.getRating();
        this.userEmail = c.getUser().getEmail();
        this.subjectName = c.getSubject().getName();
        this.createdAt = c.getCreatedAt();
        this.replies = c.getReplies().stream()
                .map(ResCommentDTO::new)
                .collect(Collectors.toList());
    }
}
