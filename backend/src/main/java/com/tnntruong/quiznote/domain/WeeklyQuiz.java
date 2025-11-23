package com.tnntruong.quiznote.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.tnntruong.quiznote.util.SecurityUtil;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "weekly_quizzes")
@Getter
@Setter
public class WeeklyQuiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private int year;
    private int weekNumber;

    private int questionCount = 10;
    private int durationMinutes = 10;

    private int maxRewardCoins = 50;

    private String difficulty = "Trung bình";

    private Instant startDate;
    private Instant endDate;

    private boolean isActive = true;

    @OneToMany(mappedBy = "weeklyQuiz", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<WeeklyQuizQuestion> weeklyQuizQuestions = new ArrayList<>();

    @OneToMany(mappedBy = "weeklyQuiz", fetch = FetchType.LAZY)
    private List<WeeklyQuizSubmission> submissions = new ArrayList<>();

    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

    @PrePersist
    public void handleCreate() {
        this.createdAt = Instant.now();
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "anonymous";
    }

    @PreUpdate
    public void handleUpdate() {
        this.updatedAt = Instant.now();
        this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "anonymous";
    }
}
