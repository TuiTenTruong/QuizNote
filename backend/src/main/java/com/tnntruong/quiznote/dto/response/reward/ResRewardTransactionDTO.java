package com.tnntruong.quiznote.dto.response.reward;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.tnntruong.quiznote.util.constant.RewardTransactionStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResRewardTransactionDTO {
    private long id;
    private UserInfo user;
    private RewardInfo reward;
    private int coinsCost;
    private RewardTransactionStatus status;
    private String deliveryInfo;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GTM + 7")
    private Instant redeemedAt;

    @Getter
    @Setter
    public static class UserInfo {
        private long id;
        private String name;
        private String email;
    }

    @Getter
    @Setter
    public static class RewardInfo {
        private long id;
        private String name;
        private String imageUrl;
    }
}
