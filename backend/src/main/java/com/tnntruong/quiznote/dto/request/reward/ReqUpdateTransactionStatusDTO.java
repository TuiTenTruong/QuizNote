package com.tnntruong.quiznote.dto.request.reward;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqUpdateTransactionStatusDTO {
    @NotBlank(message = "Trạng thái không được để trống")
    private String status;
}
