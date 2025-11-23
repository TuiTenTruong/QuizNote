package com.tnntruong.quiznote.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.Reward;

import java.util.List;

@Repository
public interface RewardRepository extends JpaRepository<Reward, Long>, JpaSpecificationExecutor<Reward> {
    List<Reward> findByIsActiveTrue();

    List<Reward> findByInStockTrueAndIsActiveTrue();
}
