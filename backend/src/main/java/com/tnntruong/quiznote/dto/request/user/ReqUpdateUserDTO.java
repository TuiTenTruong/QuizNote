package com.tnntruong.quiznote.dto.request.user;

import com.tnntruong.quiznote.util.constant.GenderEnum;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqUpdateUserDTO {
    @NotNull(message = "id cannot be empty")
    private Long id;

    private String name;

    private int age;

    private String address;

    private GenderEnum gender;

    private Long roleId;

    private String avatarUrl;
}
