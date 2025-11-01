package com.tnntruong.quiznote.dto.response;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.tnntruong.quiznote.domain.Comment;

import jakarta.annotation.Nullable;
import lombok.Data;

@Data
public class ResCommentDTO {
    private Long id;
    private String content;
    @Nullable
    private Integer rating;
    private String userEmail;
    private String subjectName;
    @JsonFormat(pattern = "yyyy-MM-dd hh:mm:ss a", timezone = "Asia/Ho_Chi_Minh")
    private Instant createdAt;
    private List<ResCommentDTO> replies;
    private CommentUser user;

    @Data
    public static class CommentUser {
        private String name;
        private String avatarUrl;
    }

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
        CommentUser commentUser = new CommentUser();
        commentUser.setName(c.getUser().getName());
        commentUser.setAvatarUrl(c.getUser().getAvatarUrl());
        this.user = commentUser;
    }
}
