package com.tnntruong.quiznote.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqChangePasswordDTO {
    @NotBlank(message = "current password cannot be empty")
    private String currentPassword;

    @NotBlank(message = "new password cannot be empty")
    private String newPassword;
}
