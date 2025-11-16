package com.tnntruong.quiznote.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqChangeStatusUserDTO {
    private long id;
    private Boolean status;
}
