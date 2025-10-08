package com.tnntruong.quiznote.service.response.Submission;

import java.time.Instant;
import com.tnntruong.quiznote.util.constant.SubmissionStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResCreateSubmission {
    private long id;
    private CurrentUser student;
    private CurrentSubject subject;
    private Boolean isPractice = false;
    private SubmissionStatus status;
    private Instant startedAt;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class CurrentSubject {
        private long id;
        private String name;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class CurrentUser {
        private long id;
        private String name;
    }
}
