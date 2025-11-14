package com.tnntruong.quiznote.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqCreateWithdrawDTO {
    private long sellerId;
    private long amount;
}
