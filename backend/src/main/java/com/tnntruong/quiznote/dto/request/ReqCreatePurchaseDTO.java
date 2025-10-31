package com.tnntruong.quiznote.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ReqCreatePurchaseDTO {
    private Long studentId;
    private Long subjectId;
}
