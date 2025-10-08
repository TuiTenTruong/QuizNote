package com.tnntruong.quiznote.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tnntruong.quiznote.domain.QuestionOption;

public interface QuestionOptionRepository extends JpaRepository<QuestionOption, Long> {

}
