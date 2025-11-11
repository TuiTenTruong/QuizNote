package com.tnntruong.quiznote.dto.request;

import com.tnntruong.quiznote.util.constant.GenderEnum;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqRegisterDTO {
    @NotBlank(message = "name cannot be empty")
    private String name;

    @NotBlank(message = "email cannot be empty")
    @Email(message = "email is invalid")
    private String email;

    @NotBlank(message = "password cannot be empty")
    private String password;

    @NotNull(message = "gender cannot be empty")
    private GenderEnum gender;

    private String role; // STUDENT or SELLER

    // Seller profile fields
    private String bankName;
    private String bankAccount;
}
