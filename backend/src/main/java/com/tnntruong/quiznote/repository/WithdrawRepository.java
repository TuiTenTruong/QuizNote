package com.tnntruong.quiznote.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.Withdraw;

@Repository
public interface WithdrawRepository extends JpaRepository<Withdraw, Long>, JpaSpecificationExecutor<Withdraw> {
    List<Withdraw> findAllBySellerId(Long sellerId);
}
