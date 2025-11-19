package com.tnntruong.quiznote.dto.response.Seller;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class ResRecentOrderDTO {
    private Long id;
    private String buyer;
    private String buyerEmail;
    @JsonFormat(pattern = "yyyy-MM-dd hh:mm:ss a", timezone = "Asia/Ho_Chi_Minh")
    private Instant purchaseDate;
}
