package com.tnntruong.quiznote.dto.request.permission;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqCreatePermissionDTO {
    @NotBlank(message = "name cannot be empty")
    private String name;

    @NotBlank(message = "apiPath cannot be empty")
    private String apiPath;

    @NotBlank(message = "method cannot be empty")
    private String method;

    @NotBlank(message = "module cannot be empty")
    private String module;
}
