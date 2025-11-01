package com.tnntruong.quiznote.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.SubmissionAnswer;

@Repository
public interface SubmissionAnswerRepository extends JpaRepository<SubmissionAnswer, Long> {
    long countByQuestionIdAndIsCorrect(Long questionId, boolean isCorrect);

    long countByQuestionId(Long questionId);
}
