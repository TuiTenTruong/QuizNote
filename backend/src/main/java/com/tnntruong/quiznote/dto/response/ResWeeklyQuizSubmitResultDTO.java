package com.tnntruong.quiznote.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResWeeklyQuizSubmitResultDTO {
    private int score;
    private int totalQuestions;
    private double accuracyPercent;
    private int coinsEarned;
    private int streakBonus;
    private int currentStreak;
    private int timeTaken;
    private String message;
}
