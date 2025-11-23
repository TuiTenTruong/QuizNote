package com.tnntruong.quiznote.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.WeeklyQuiz;

@Repository
public interface WeeklyQuizRepository extends JpaRepository<WeeklyQuiz, Long>, JpaSpecificationExecutor<WeeklyQuiz> {
    Optional<WeeklyQuiz> findByYearAndWeekNumber(int year, int weekNumber);
    
    Optional<WeeklyQuiz> findTopByIsActiveTrueOrderByYearDescWeekNumberDesc();
}
