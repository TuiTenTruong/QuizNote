package com.tnntruong.quiznote.service.response.user;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.tnntruong.quiznote.util.constant.GenderEnum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class ResGetUserDTO {
    private long id;
    private String name;
    private String email;
    private GenderEnum gender;
    private String address;
    private int age;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GTM + 7")
    private Instant createdAt;
    private String createdBy;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GTM + 7")
    private Instant updatedAt;
    private String updatedBy;

    private RoleUser role;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RoleUser {
        private long id;
        private String name;
    }
}
