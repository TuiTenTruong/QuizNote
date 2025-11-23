package com.tnntruong.quiznote.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.RewardTransaction;
import com.tnntruong.quiznote.domain.User;

import java.util.List;

@Repository
public interface RewardTransactionRepository
        extends JpaRepository<RewardTransaction, Long>, JpaSpecificationExecutor<RewardTransaction> {
    Page<RewardTransaction> findByUser(User user, Pageable pageable);

    List<RewardTransaction> findByUser(User user);

    boolean existsByRewardId(long rewardId);
}
