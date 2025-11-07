package com.tnntruong.quiznote.dto.response.Submission;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResStudentAnalytics {
    private Integer totalQuizzesCompleted;
    private Double averageAccuracy;
    private Integer activeDays;
    private Long totalTimeSpent; // in seconds
    private List<SubjectStats> subjectStats;
    private List<AccuracyBySubject> accuracyBySubject;
    private List<DailyActivity> recentActivity;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SubjectStats {
        private String subjectName;
        private Integer count;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AccuracyBySubject {
        private String subjectName;
        private Double accuracy;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DailyActivity {
        private String date;
        private Integer quizCount;
        private Double avgScore;
    }
}
