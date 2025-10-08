package com.tnntruong.quiznote.service.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqUpdateQuestionDTO {
    @NotNull(message = "Question id cannot be null")
    private long id;
    @NotNull(message = "SubjectId cannot be null")
    private Long subjectId;
    private Long chapterId;
    @NotBlank(message = "Content cannot be blank")
    private String content;
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
