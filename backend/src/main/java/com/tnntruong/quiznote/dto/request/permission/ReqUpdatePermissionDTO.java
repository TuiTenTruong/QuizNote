package com.tnntruong.quiznote.dto.request.permission;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqUpdatePermissionDTO {
    @NotNull(message = "id cannot be empty")
    private Long id;

    private String name;

    private String apiPath;

    private String method;

    private String module;
}
