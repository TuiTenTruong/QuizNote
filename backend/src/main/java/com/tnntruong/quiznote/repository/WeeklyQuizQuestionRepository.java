package com.tnntruong.quiznote.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.WeeklyQuizQuestion;

@Repository
public interface WeeklyQuizQuestionRepository extends JpaRepository<WeeklyQuizQuestion, Long> {
    List<WeeklyQuizQuestion> findByWeeklyQuizIdOrderByOrderIndexAsc(long weeklyQuizId);
    
    void deleteByWeeklyQuizId(long weeklyQuizId);
}
