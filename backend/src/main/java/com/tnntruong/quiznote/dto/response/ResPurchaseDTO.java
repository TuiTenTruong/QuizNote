package com.tnntruong.quiznote.dto.response;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResPurchaseDTO {

    private Long id;
    private CurrentUser student;
    private List<CurrentSubject> subjectList;
    private Instant purchasedAt;

    @Getter
    @Setter
    public static class CurrentUser {
        private long id;
        private String username;
    }

    @Getter
    @Setter
    public static class CurrentSubject {
        private long id;
        private String name;
        private String description;
        private String imageUrl;
        private int questionCount;
        private double averageRating;
        @JsonFormat(pattern = "yyyy-MM-dd hh:mm:ss a", timezone = "Asia/Ho_Chi_Minh")
        private Instant purchasedAt;
    }

}
