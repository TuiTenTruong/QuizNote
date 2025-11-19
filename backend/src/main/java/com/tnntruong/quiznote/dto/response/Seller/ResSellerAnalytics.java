package com.tnntruong.quiznote.dto.response.Seller;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResSellerAnalytics {
    private Long totalRevenue;
    private Long pendingWithdraw;
    private Long availableBalance;
    private Integer totalQuizzesSold;
    private Integer totalSubjects;
    private Double averageRating;
    private Integer totalViews;
    private List<SubjectStat> topSubjects;
    private List<RecentOrder> recentOrders;
    private List<MonthlyRevenue> monthlyRevenue;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SubjectStat {
        private Long subjectId;
        private String subjectName;
        private Double price;
        private Integer salesCount;
        private Double rating;
        private Integer ratingCount;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RecentOrder {
        private Long purchaseId;
        private String buyerName;
        private String subjectName;
        private Double price;
        @JsonFormat(pattern = "yyyy-MM-dd hh:mm:ss a", timezone = "Asia/Ho_Chi_Minh")
        private Instant purchasedAt;
        private String status;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyRevenue {
        private String month;
        private Long revenue;
        private Integer salesCount;
    }
}
