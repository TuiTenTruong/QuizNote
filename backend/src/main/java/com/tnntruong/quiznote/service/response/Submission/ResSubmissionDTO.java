package com.tnntruong.quiznote.service.response.Submission;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ResSubmissionDTO {
    private Long id;
    private Long subjectId;
    private Boolean isPractice;
    private Double score;
    private Integer correctCount;
    private Integer totalQuestions;
    private List<ResSubmissionAnswerDTO> answers;

    @Getter
    @Setter
    public static class ResSubmissionAnswerDTO {
        private Long questionId;
        private String questionContent;
        private Long selectedOptionId;
        private Boolean isCorrect;
    }

}
