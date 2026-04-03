package com.tnntruong.quiznote.dto.request.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqChangeStatusUserDTO {
    private long id;
    private Boolean status;
}
