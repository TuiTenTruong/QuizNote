package com.tnntruong.quiznote.dto.response.reward;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResRewardDTO {
    private long id;
    private String name;
    private String description;
    private String imageUrl;
    private int cost;
    private int stockQuantity;
    private boolean inStock;
    private boolean isActive;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GTM + 7")
    private Instant createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GTM + 7")
    private Instant updatedAt;
}
