package com.tnntruong.quiznote.dto.response;

import java.util.List;

import com.tnntruong.quiznote.util.constant.QuestionTypeEnum;

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
    private QuestionTypeEnum type = QuestionTypeEnum.ONE_CHOICE;
    private String imageUrl;
    private String explanation;
    private Long subjectId;
    private ChapterDTO chapter;
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

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChapterDTO {
        private Long id;
        private String name;
    }

    public ResQuestionDTO(Long id, String content, QuestionTypeEnum type, String imageUrl, String explanation,
            Long subjectId, ChapterDTO chapter,
            List<ResOptionDTO> options, Double correctnessPercentage) {
        this.id = id;
        this.content = content;
        this.type = type;
        this.imageUrl = imageUrl;
        this.explanation = explanation;
        this.subjectId = subjectId;
        this.chapter = chapter;
        this.options = options;
        this.correctnessPercentage = correctnessPercentage;
    }
}
