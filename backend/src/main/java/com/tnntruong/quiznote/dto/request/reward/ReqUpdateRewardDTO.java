package com.tnntruong.quiznote.dto.request.reward;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqUpdateRewardDTO {
    private String name;
    private String description;
    private String imageUrl;

    @Min(value = 1, message = "Giá xu phải lớn hơn 0")
    private Integer cost;

    @Min(value = 0, message = "Số lượng phải lớn hơn hoặc bằng 0")
    private Integer stockQuantity;

    private Boolean inStock;
    private Boolean active;
}
