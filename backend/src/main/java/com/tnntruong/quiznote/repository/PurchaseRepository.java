package com.tnntruong.quiznote.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.Purchase;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long>, JpaSpecificationExecutor<Purchase> {
    Optional<Purchase> findByStudentIdAndSubjectId(long studentId, long subjectId);

    List<Purchase> findByStudentId(long id);

    List<Purchase> findBySubjectId(long id);

    @Query("SELECT COALESCE(SUM(s.price), 0.0) FROM Purchase p JOIN p.subject s")
    Double sumAllPurchaseAmount();

    @Query("SELECT COALESCE(SUM(s.price), 0.0) FROM Purchase p JOIN p.subject s WHERE p.purchasedAt >= :startDate")
    Double sumPurchaseAmountAfter(@Param("startDate") Instant startDate);

    @Query("SELECT count(p) FROM Purchase p WHERE p.purchasedAt >= :startDate")
    long countPurchaseAfter(@Param("startDate") Instant startDate);

    @Query("SELECT COALESCE(SUM(s.price), 0.0) FROM Purchase p JOIN p.subject s WHERE FUNCTION('YEAR', p.purchasedAt) = :year AND FUNCTION('MONTH', p.purchasedAt) = :month")
    Double sumPurchaseAmountByMonth(@Param("year") int year, @Param("month") int month);

    void deleteByStudentId(Long studentId);

    void deleteBySellerId(Long sellerId);

}
