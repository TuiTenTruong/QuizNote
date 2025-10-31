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

}
