package com.tnntruong.quiznote.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.WeeklyQuizSubmission;

@Repository
public interface WeeklyQuizSubmissionRepository extends JpaRepository<WeeklyQuizSubmission, Long>, JpaSpecificationExecutor<WeeklyQuizSubmission> {
    Optional<WeeklyQuizSubmission> findByWeeklyQuizIdAndStudentId(long weeklyQuizId, long studentId);
    
    List<WeeklyQuizSubmission> findByStudentIdOrderBySubmittedAtDesc(long studentId);
    
    long countByWeeklyQuizId(long weeklyQuizId);
    
    List<WeeklyQuizSubmission> findByWeeklyQuizIdOrderByScoreDesc(long weeklyQuizId);
    
    void deleteByWeeklyQuizId(long weeklyQuizId);
    
    List<WeeklyQuizSubmission> findByWeeklyQuizId(long weeklyQuizId);
}
