package com.tnntruong.quiznote.dto.request;

import com.tnntruong.quiznote.util.constant.GenderEnum;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqUpdateProfileDTO {
    @NotBlank(message = "name cannot be empty")
    private String name;

    private int age;
    private String address;
    private GenderEnum gender;
    private String bio;
}
