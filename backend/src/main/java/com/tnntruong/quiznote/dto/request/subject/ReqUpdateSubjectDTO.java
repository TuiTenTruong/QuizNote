package com.tnntruong.quiznote.dto.request.subject;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReqUpdateSubjectDTO {
    @NotNull(message = "id cannot be empty")
    private Long id;

    private String name;

    private String description;

    @DecimalMin(value = "0.0", message = "price cannot be less than 0")
    private Double price;
}
