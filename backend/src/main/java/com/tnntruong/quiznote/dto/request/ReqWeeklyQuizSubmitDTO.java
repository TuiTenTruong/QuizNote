package com.tnntruong.quiznote.dto.request;

import java.util.Map;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqWeeklyQuizSubmitDTO {
    @NotNull(message = "ID Weekly Quiz không được để trống")
    private Long weeklyQuizId;

    // Map: questionId -> selectedOptionId
    @NotNull(message = "Câu trả lời không được để trống")
    private Map<Long, Long> answers;

    // Thời gian làm bài (giây)
    @NotNull(message = "Thời gian làm bài không được để trống")
    private Integer timeTaken;
}
