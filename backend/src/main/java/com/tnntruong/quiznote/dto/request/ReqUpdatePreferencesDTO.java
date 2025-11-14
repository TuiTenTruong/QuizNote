package com.tnntruong.quiznote.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqUpdatePreferencesDTO {
    private String theme;
    private String accentColor;
}
