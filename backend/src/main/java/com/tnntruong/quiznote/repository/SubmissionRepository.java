package com.tnntruong.quiznote.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.Submission;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    @Query("SELECT MAX(s.score) FROM Submission s WHERE s.subject.id = :subjectId AND s.status = 'SUBMITTED'")
    Double findHighestScoreBySubjectId(@Param("subjectId") Long subjectId);
}
