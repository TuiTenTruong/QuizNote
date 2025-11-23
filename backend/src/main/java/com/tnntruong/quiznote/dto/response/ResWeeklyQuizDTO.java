package com.tnntruong.quiznote.dto.response;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResWeeklyQuizDTO {
    private long id;
    private String title;
    private String description;
    private int year;
    private int weekNumber;
    private String weekLabel;
    private int questionCount;
    private int durationMinutes;
    private int maxRewardCoins;
    private String difficulty;
    @JsonFormat(pattern = "yyyy-MM-dd hh:mm:ss a", timezone = "Asia/Ho_Chi_Minh")
    private Instant startDate;
    @JsonFormat(pattern = "yyyy-MM-dd hh:mm:ss a", timezone = "Asia/Ho_Chi_Minh")
    private Instant endDate;
    private boolean isActive;
    private List<ResQuestionDTO> questions;
    @JsonFormat(pattern = "yyyy-MM-dd hh:mm:ss a", timezone = "Asia/Ho_Chi_Minh")
    private Instant createdAt;
    private String createdBy;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ResQuestionDTO {
        private long id;
        private String content;
        private String imageUrl;
        private List<ResOptionDTO> options;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ResOptionDTO {
        private long id;
        private String content;
        private Boolean isCorrect;
    }
}
