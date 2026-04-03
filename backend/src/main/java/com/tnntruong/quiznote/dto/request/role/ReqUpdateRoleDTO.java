package com.tnntruong.quiznote.dto.request.role;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqUpdateRoleDTO {
    @NotNull(message = "id cannot be empty")
    private Long id;

    private String name;

    private String description;

    private Boolean active;
}
