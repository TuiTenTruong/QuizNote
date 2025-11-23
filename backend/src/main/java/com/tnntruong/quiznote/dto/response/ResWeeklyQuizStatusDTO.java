package com.tnntruong.quiznote.dto.response;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResWeeklyQuizStatusDTO {
    private boolean hasPlayed;
    private Integer score;
    private Integer coinsEarned;
    private Double accuracyPercent;
    private Integer timeTaken;
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer totalStreakBonus;
    @JsonFormat(pattern = "yyyy-MM-dd hh:mm:ss a", timezone = "Asia/Ho_Chi_Minh")
    private Instant submittedAt;
}
