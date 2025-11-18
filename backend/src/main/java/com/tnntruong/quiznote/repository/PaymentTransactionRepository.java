package com.tnntruong.quiznote.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.PaymentTransaction;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    boolean existsByTransactionNo(String no);

    void deleteByBuyerId(Long buyerId);

    void deleteBySellerId(Long sellerId);
}
