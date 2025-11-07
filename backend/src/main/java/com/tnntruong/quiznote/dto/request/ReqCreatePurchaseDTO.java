package com.tnntruong.quiznote.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class ReqCreatePurchaseDTO {
    private Long studentId;
    private Long subjectId;
}
