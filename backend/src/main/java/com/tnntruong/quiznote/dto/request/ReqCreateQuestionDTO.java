package com.tnntruong.quiznote.dto.request;

import java.util.List;

import com.tnntruong.quiznote.util.constant.QuestionTypeEnum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqCreateQuestionDTO {
    @NotNull(message = "SubjectId cannot be null")
    private Long subjectId;
    private Long chapterId;
    @NotBlank(message = "Content cannot be blank")
    private String content;
    private QuestionTypeEnum type = QuestionTypeEnum.ONE_CHOICE;
    private String explanation;
    private List<ReqOptionDTO> options;

    @Getter
    @Setter
    public static class ReqOptionDTO {
        private String content;
        private Boolean isCorrect;
        private Integer optionOrder;
    }
}
