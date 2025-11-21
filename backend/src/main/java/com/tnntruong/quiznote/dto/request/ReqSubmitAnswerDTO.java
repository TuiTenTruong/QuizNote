package com.tnntruong.quiznote.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqSubmitAnswerDTO {
    @NotNull(message = "Question ID is required")
    private Long questionId;
    private List<Long> selectedOptionIds;
    private Long selectedOptionId;
}