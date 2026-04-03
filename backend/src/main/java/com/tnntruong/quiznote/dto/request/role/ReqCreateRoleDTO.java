package com.tnntruong.quiznote.dto.request.role;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqCreateRoleDTO {
    @NotBlank(message = "name cannot be empty")
    private String name;

    private String description;

    private boolean active = true;
}
