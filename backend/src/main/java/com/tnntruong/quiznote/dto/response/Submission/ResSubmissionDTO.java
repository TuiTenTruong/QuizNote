package com.tnntruong.quiznote.dto.response.Submission;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ResSubmissionDTO {
    private Long id;
    private CurrentSubject currentSubject;

    private Double score;
    private Integer correctCount;
    private Integer totalQuestions;
    private Long duration;
    private String status; // thời gian cho phép (phút)
    private Long timeSpent; // thời gian đã dùng (giây)

    @JsonFormat(pattern = "yyyy-MM-dd hh:mm:ss a", timezone = "Asia/Ho_Chi_Minh")
    private Instant startedAt;
    @JsonFormat(pattern = "yyyy-MM-dd hh:mm:ss a", timezone = "Asia/Ho_Chi_Minh")
    private Instant submittedAt;
    private List<ResSubmissionAnswerDTO> answers;

    @Getter
    @Setter
    public static class ResSubmissionAnswerDTO {
        private Long questionId;
        private String questionContent;
        private Long selectedOptionId;
        private Boolean isCorrect;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class CurrentSubject {
        private Long id;
        private String name;
    }

}
