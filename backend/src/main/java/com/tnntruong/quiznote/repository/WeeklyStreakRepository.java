package com.tnntruong.quiznote.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.WeeklyStreak;

@Repository
public interface WeeklyStreakRepository extends JpaRepository<WeeklyStreak, Long> {
    Optional<WeeklyStreak> findByStudentId(long studentId);
}
