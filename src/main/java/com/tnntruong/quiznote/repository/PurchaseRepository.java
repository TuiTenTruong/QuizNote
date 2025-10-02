package com.tnntruong.quiznote.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.Purchase;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long>, JpaSpecificationExecutor<Purchase> {
    Optional<Purchase> findByStudentIdAndSubjectId(long studentId, long subjectId);

    List<Purchase> findByStudentId(long id);

    List<Purchase> findBySubjectId(long id);
}
