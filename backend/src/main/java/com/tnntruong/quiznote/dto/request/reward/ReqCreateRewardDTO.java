package com.tnntruong.quiznote.dto.request.reward;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqCreateRewardDTO {
    @NotBlank(message = "Tên quà không được để trống")
    private String name;

    private String description;

    @NotNull(message = "Giá xu không được để trống")
    @Min(value = 1, message = "Giá xu phải lớn hơn 0")
    private Integer cost;

    @Min(value = 0, message = "Số lượng phải lớn hơn hoặc bằng 0")
    private int stockQuantity = 0;

    private boolean inStock = true;
}
