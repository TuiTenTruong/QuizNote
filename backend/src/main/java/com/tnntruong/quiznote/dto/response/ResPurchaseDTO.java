package com.tnntruong.quiznote.dto.response;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResPurchaseDTO {

    private Long id;
    private CurrentUser student;
    private CurrentSubject subject;
    private Instant purchasedAt;

    @Getter
    @Setter
    public static class CurrentUser {
        private long id;
        private String username;
    }

    @Getter
    @Setter
    public static class CurrentSubject {
        private long id;
        private String subjectname;
    }

}
