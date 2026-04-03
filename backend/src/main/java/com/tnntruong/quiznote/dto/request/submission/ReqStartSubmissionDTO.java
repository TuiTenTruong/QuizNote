package com.tnntruong.quiznote.dto.request.submission;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqStartSubmissionDTO {
    private Long userId;
    private Long subjectId;
    private Long duration;
    private boolean isPractice;
}
