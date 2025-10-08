package com.tnntruong.quiznote.service.response.subject;

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
    private CurrentUser currentuser;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GTM + 7")
    private Instant createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GTM + 7")
    private Instant updatedAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CurrentUser {
        private long id;
        private String username;
    }
}
