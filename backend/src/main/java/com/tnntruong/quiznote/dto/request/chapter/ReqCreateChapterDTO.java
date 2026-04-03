package com.tnntruong.quiznote.dto.request.chapter;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqCreateChapterDTO {
    private String name;
    private Long subjectId;
}
