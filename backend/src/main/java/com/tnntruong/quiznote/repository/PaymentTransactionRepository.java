package com.tnntruong.quiznote.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.PaymentTransaction;

@Repository
public interface PaymentTransactionRepository
        extends JpaRepository<PaymentTransaction, Long>, JpaSpecificationExecutor<PaymentTransaction> {
    boolean existsByTransactionNo(String no);

    void deleteByBuyerId(Long buyerId);

    void deleteBySellerId(Long sellerId);

    List<PaymentTransaction> findBySubjectId(Long subjectId);
}
