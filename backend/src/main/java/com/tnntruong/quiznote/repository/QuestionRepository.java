package com.tnntruong.quiznote.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.tnntruong.quiznote.domain.Question;

public interface QuestionRepository extends JpaRepository<Question, Long>, JpaSpecificationExecutor<Question> {

    Optional<List<Question>> findAllBySubjectId(long id);

    Optional<List<Question>> findAllByChapterId(long id);
}
