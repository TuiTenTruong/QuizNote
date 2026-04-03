package com.tnntruong.quiznote.dto.request.user;

import com.tnntruong.quiznote.util.constant.GenderEnum;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqCreateUserDTO {
    @NotBlank(message = "name cannot be empty")
    private String name;

    @NotBlank(message = "email cannot be empty")
    @Email(message = "email is invalid")
    private String email;

    @NotBlank(message = "password cannot be empty")
    private String password;

    @NotNull(message = "gender cannot be empty")
    private GenderEnum gender;

    private Long roleId;

    private int age;

    private String address;

    // Seller profile fields
    private String bankName;
    private String bankAccount;
}
