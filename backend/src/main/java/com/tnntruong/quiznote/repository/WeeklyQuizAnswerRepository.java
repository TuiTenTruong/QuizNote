package com.tnntruong.quiznote.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.WeeklyQuizAnswer;

@Repository
public interface WeeklyQuizAnswerRepository extends JpaRepository<WeeklyQuizAnswer, Long> {
    List<WeeklyQuizAnswer> findByWeeklySubmissionId(long weeklySubmissionId);

    void deleteByWeeklySubmissionId(long weeklySubmissionId);
    
    void deleteByWeeklySubmission_WeeklyQuizId(long weeklyQuizId);
}
