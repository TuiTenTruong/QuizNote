package com.tnntruong.quiznote.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResQuestionDTO {
    private Long id;
    private String content;
    private String explanation;
    private Long subjectId;
    private Long chapterId;
    private Double correctnessPercentage;
    private List<ResOptionDTO> options;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResOptionDTO {
        private Long id;
        private String content;
        private Boolean isCorrect;
        private Integer optionOrder;
    }

    public ResQuestionDTO(Long id, String content, String explanation, Long subjectId, Long chapterId,
            List<ResOptionDTO> options, Double correctnessPercentage) {
        this.id = id;
        this.content = content;
        this.explanation = explanation;
        this.subjectId = subjectId;
        this.chapterId = chapterId;
        this.options = options;
        this.correctnessPercentage = correctnessPercentage;
    }
}
