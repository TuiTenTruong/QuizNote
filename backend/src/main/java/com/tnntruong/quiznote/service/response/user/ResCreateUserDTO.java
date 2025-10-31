package com.tnntruong.quiznote.service.response.user;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.tnntruong.quiznote.util.constant.GenderEnum;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResCreateUserDTO {
    private long id;
    private String name;
    private String email;
    private GenderEnum gender;
    private String address;
    private int age;
    private String avatarUrl;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GTM + 7")
    private Instant createdAt;
    private String createdBy;
}
