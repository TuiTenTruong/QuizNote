package com.tnntruong.quiznote.dto.response.admin;

import java.util.List;

import lombok.Data;

@Data
public class ResAdminAnalyticsDTO {
    private List<StatusCard> statusCards;
    private List<MonthlyRevenue> monthlyRevenues;
    private List<CurrentUsers> currentUsers;
    private List<UserRoleCount> userRoleCounts;

    @Data
    public static class StatusCard {
        private String title;
        private Long value;
        private Double change;
    }

    @Data
    public static class MonthlyRevenue {
        private String month;
        private Double revenue;
    }

    @Data
    public static class CurrentUsers {
        private String name;
        private String email;
        private String role;
        private String status;
        private String joinDate;
    }

    @Data
    public static class UserRoleCount {
        private String role;
        private Long count;
    }

}
