package com.tnntruong.quiznote.dto.response.subject;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.tnntruong.quiznote.util.constant.SubjectStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResSubjectDTO {
    private Long id;
    private String name;
    private String description;
    private double price;
    private SubjectStatus status;
    private Double averageRating;
    private Integer ratingCount;
    private Integer purchaseCount;
    private Double highestScore;
    private int questionCount;
    private String imageUrl;
    private CreateUser createUser;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GTM + 7")
    private Instant createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GTM + 7")
    private Instant updatedAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateUser {
        private long id;
        private String username;
        private String avatarUrl;
    }
}
