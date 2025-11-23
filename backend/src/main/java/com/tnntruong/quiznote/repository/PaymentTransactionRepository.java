package com.tnntruong.quiznote.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.PaymentTransaction;

@Repository
public interface PaymentTransactionRepository
        extends JpaRepository<PaymentTransaction, Long>, JpaSpecificationExecutor<PaymentTransaction> {
    boolean existsByTransactionNo(String no);

    void deleteByBuyerId(Long buyerId);

    void deleteBySellerId(Long sellerId);

    List<PaymentTransaction> findBySubjectId(Long subjectId);

    @Query("SELECT COALESCE(SUM(p.amount), 0.0) FROM PaymentTransaction p WHERE FUNCTION('YEAR', p.createdAt) = :year AND FUNCTION('MONTH', p.createdAt) = :month")
    Double sumPurchaseAmountByMonth(@Param("year") int year, @Param("month") int month);

    @Query("SELECT COALESCE(SUM(p.amount), 0.0) FROM PaymentTransaction p WHERE p.createdAt > :after")
    Double sumPurchaseAmountAfter(@Param("after") java.time.Instant after);

    @Query("SELECT COALESCE(SUM(p.amount), 0.0) FROM PaymentTransaction p")
    Double sumAllPurchaseAmount();

    long countByCreatedAtAfter(@Param("after") java.time.Instant after);
}
