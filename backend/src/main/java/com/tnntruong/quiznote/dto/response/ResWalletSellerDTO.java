package com.tnntruong.quiznote.dto.response;

import java.util.List;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResWalletSellerDTO {
    private Long sellerId;
    private Long earnThisMonth;
    private Long availableBalance;
    private Long pendingWithdraw;
    private Long pendingBalance;
    private Long totalEarnings;
    private List<WithdrawHistoryDTO> withdrawHistories;

    @Data
    public static class WithdrawHistoryDTO {
        private Long id;
        private Long amount;
        private String status;
        private String requestedAt;
        private String processedAt;
    }
}
