package com.tnntruong.quiznote.dto.request.reward;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqRedeemRewardDTO {
    @NotNull(message = "ID quà không được để trống")
    private Long rewardId;

    private String recipientName;
    private String recipientPhone;
    private String recipientAddress;

}
