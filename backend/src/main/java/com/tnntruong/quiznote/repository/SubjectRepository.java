package com.tnntruong.quiznote.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long>, JpaSpecificationExecutor<Subject> {

    @Query("SELECT count(u) FROM Subject u WHERE u.createdAt >= :startDate")
    long countSubjectsCreatedAfter(@Param("startDate") Instant startDate);

    @Query("SELECT s FROM Subject s WHERE s.status = 'ACTIVE' ORDER BY s.purchaseCount DESC LIMIT 6")
    List<Subject> findTop6ByStatusOrderByPurchaseCountDesc();

    void deleteBySellerId(Long sellerId);
}
