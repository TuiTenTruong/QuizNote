package com.tnntruong.quiznote.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long>, JpaSpecificationExecutor<Comment> {
    @Query("SELECT AVG(c.rating) FROM Comment c WHERE c.subject.id = :subjectId AND c.parentComment IS NULL")
    Double findAverageRatingBySubjectId(@Param("subjectId") Long subjectId);

    List<Comment> findBySubjectIdAndParentCommentIsNull(Long subjectId);

    void deleteByUserId(Long userId);
}
