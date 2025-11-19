package com.tnntruong.quiznote.dto.request;

import lombok.Data;

@Data
public class ReqCreateCommentDTO {
    private String content;
    private int rating;
    private Long userId;
}
