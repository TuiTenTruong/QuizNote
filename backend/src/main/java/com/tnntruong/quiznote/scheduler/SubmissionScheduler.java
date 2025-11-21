package com.tnntruong.quiznote.scheduler;

import java.time.Instant;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.tnntruong.quiznote.domain.Submission;
import com.tnntruong.quiznote.repository.SubmissionRepository;
import com.tnntruong.quiznote.util.constant.SubmissionStatus;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class SubmissionScheduler {

    private final SubmissionRepository submissionRepository;

    public SubmissionScheduler(SubmissionRepository submissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void autoSubmitExpiredSubmissions() {
        try {
            List<Submission> inProgressSubmissions = submissionRepository.findByStatus(SubmissionStatus.IN_PROGRESS);

            Instant now = Instant.now();
            int autoSubmittedCount = 0;

            for (Submission submission : inProgressSubmissions) {
                if (submission.getStartedAt() != null && submission.getDuration() != null) {
                    // Calculate end time: startedAt + duration (in minutes)
                    Instant endTime = submission.getStartedAt().plusSeconds(submission.getDuration() * 60L);

                    // Check if time has expired (with 10 second grace period for submission in progress)
                    Instant gracePeriodEnd = endTime.plusSeconds(10);
                    if (now.isAfter(gracePeriodEnd)) {
                        // Auto-submit - only update status and metadata
                        // Keep existing answers if they were submitted during grace period
                        // If no answers exist, score will remain 0.0 (default)
                        submission.setStatus(SubmissionStatus.SUBMITTED);
                        submission.setSubmittedAt(now);
                        
                        // Only set to 0 if not already set by actual submission
                        if (submission.getScore() == null || submission.getScore() == 0.0) {
                            submission.setScore(0.0);
                        }
                        if (submission.getCorrectCount() == null || submission.getCorrectCount() == 0) {
                            submission.setCorrectCount(0);
                        }
                        if (submission.getTotalQuestions() == null || submission.getTotalQuestions() == 0) {
                            submission.setTotalQuestions(0);
                        }

                        // Calculate time spent (should be equal to duration since time expired)
                        long timeSpentSeconds = now.getEpochSecond() - submission.getStartedAt().getEpochSecond();
                        submission.setTimeSpent(timeSpentSeconds);

                        submissionRepository.save(submission);
                        autoSubmittedCount++;

                        log.info("Auto-submitted expired submission ID: {} for student ID: {} with score: {}",
                                submission.getId(), submission.getStudent().getId(), submission.getScore());
                    }
                }
            }

            if (autoSubmittedCount > 0) {
                log.info("Auto-submitted {} expired submissions", autoSubmittedCount);
            }

        } catch (Exception e) {
            log.error("Error in auto-submit scheduler", e);
        }
    }
}
