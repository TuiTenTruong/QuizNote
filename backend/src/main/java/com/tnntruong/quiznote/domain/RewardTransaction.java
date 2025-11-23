package com.tnntruong.quiznote.domain;

import java.time.Instant;

import com.tnntruong.quiznote.util.constant.RewardTransactionStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "reward_transactions")
public class RewardTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "reward_id")
    private Reward reward;

    private int coinsCost;

    @Enumerated(EnumType.STRING)
    private RewardTransactionStatus status = RewardTransactionStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String deliveryInfo;

    private Instant redeemedAt;

    @PrePersist
    public void handleCreate() {
        this.redeemedAt = Instant.now();
    }
}
