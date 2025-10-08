package com.tnntruong.quiznote.service.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqVNPayDTO {
    private Long amount;
    private String orderInfo;
    private String bankCode;
    private String orderType;
    private Integer expireMinutes;
}
