package com.tnntruong.quiznote.dto.request;

import java.time.Instant;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqWeeklyQuizDTO {
    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    private String description;

    @NotNull(message = "Năm không được để trống")
    @Min(value = 2024, message = "Năm phải từ 2024 trở đi")
    private Integer year;

    @NotNull(message = "Số tuần không được để trống")
    @Min(value = 1, message = "Số tuần phải từ 1 đến 53")
    @Max(value = 53, message = "Số tuần phải từ 1 đến 53")
    private Integer weekNumber;

    private String difficulty = "Trung bình";

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private Instant startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private Instant endDate;

    @NotNull(message = "Danh sách câu hỏi không được để trống")
    @Size(min = 10, max = 10, message = "Phải có đúng 10 câu hỏi")
    @Valid
    private List<QuestionDTO> questions;

    @Getter
    @Setter
    public static class QuestionDTO {
        @NotBlank(message = "Nội dung câu hỏi không được để trống")
        private String content;

        private String imageUrl;

        @NotNull(message = "Danh sách đáp án không được để trống")
        @Size(min = 2, max = 4, message = "Phải có từ 2 đến 4 đáp án")
        @Valid
        private List<OptionDTO> options;
    }

    @Getter
    @Setter
    public static class OptionDTO {
        @NotBlank(message = "Nội dung đáp án không được để trống")
        private String content;

        @NotNull(message = "Phải chỉ định đáp án đúng")
        private Boolean isCorrect;
    }
}
