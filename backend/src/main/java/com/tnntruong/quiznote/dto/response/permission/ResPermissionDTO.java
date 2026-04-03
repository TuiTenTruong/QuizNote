package com.tnntruong.quiznote.dto.response.permission;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResPermissionDTO {
    private Long id;
    private String name;
    private String apiPath;
    private String method;
    private String module;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "Asia/Ho_Chi_Minh")
    private Instant createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "Asia/Ho_Chi_Minh")
    private Instant updatedAt;
}
