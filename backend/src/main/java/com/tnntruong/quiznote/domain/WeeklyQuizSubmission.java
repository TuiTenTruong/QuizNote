package com.tnntruong.quiznote.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.tnntruong.quiznote.util.SecurityUtil;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "weekly_quiz_submissions")
@Getter
@Setter
public class WeeklyQuizSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weekly_quiz_id", nullable = false)
    private WeeklyQuiz weeklyQuiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    private int score;

    private int coinsEarned;
    private int timeTaken;
    private double accuracyPercent;

    @OneToMany(mappedBy = "weeklySubmission", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<WeeklyQuizAnswer> answers = new ArrayList<>();

    private Instant submittedAt;
    private String submittedBy;

    @PrePersist
    public void handleCreate() {
        this.submittedAt = Instant.now();
        this.submittedBy = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "anonymous";
    }
}
