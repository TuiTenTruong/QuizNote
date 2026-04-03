package com.tnntruong.quiznote.dto.request.subject;

import jakarta.validation.constraints.DecimalMin;
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
public class ReqCreateSubjectDTO {
    @NotBlank(message = "name cannot be empty")
    private String name;

    private String description;

    @NotNull(message = "price cannot be empty")
    @DecimalMin(value = "0.0", message = "price cannot be less than 0")
    private Double price;
}
