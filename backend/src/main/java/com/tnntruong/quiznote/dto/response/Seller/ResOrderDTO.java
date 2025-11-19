package com.tnntruong.quiznote.dto.response.Seller;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class ResOrderDTO {
    private Long id;
    private String transactionNo;
    private String orderInfo;
    private String paymentTime;
    private Long amount;
    private String status;
    private String paymentMethod;
    private SellerDTO seller;
    private BuyerDTO buyer;
    private SubjectDTO subject;
    @JsonFormat(pattern = "yyyy-MM-dd hh:mm:ss a", timezone = "Asia/Ho_Chi_Minh")
    private Instant createdAt;

    @Data
    public static class SellerDTO {
        private Long id;
        private String name;
        private String email;
    }

    @Data
    public static class BuyerDTO {
        private Long id;
        private String name;
        private String email;
    }

    @Data
    public static class SubjectDTO {
        private Long id;
        private String name;
    }

}
