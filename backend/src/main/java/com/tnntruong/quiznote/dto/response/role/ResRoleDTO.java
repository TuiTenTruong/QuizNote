package com.tnntruong.quiznote.dto.response.role;

import java.time.Instant;

import org.springframework.security.access.method.P;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResRoleDTO {
    private Long id;
    private String name;
    private String description;
    private boolean active;

    private PermissionDTO[] permissions;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "Asia/Ho_Chi_Minh")
    private Instant createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "Asia/Ho_Chi_Minh")
    private Instant updatedAt;

    private String createdBy;
    private String updatedBy;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PermissionDTO {
        private Long id;
        private String name;
        private String apiPath;
        private String method;
        private String module;
    }
}
