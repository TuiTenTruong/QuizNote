package com.tnntruong.quiznote.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResVNPayDTO {
    private boolean validHash;
    private String responseCode;
    private String txnRef;
    private String bankTranNo;
    private String message;
}
