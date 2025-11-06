package com.tnntruong.quiznote.dto.response.Submission;

import java.time.Instant;
import com.tnntruong.quiznote.util.constant.SubmissionStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResCreateSubmission {
    private Long id;
    private CurrentUser student;
    private CurrentSubject subject;
    private Long duration; // thời gian làm bài (phút)
    private SubmissionStatus status;
    private Instant startedAt;
    private Instant endTime;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CurrentUser {
        private Long id;
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CurrentSubject {
        private Long id;
        private String name;
    }
}
