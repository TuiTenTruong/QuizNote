package com.tnntruong.quiznote.service.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqStartSubmissionDTO {
    private Long userId;
    private Long subjectId;
    private Boolean isPractice = true;
    // private Long examId;
}
