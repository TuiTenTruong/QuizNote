package com.tnntruong.quiznote.domain;

import com.tnntruong.quiznote.util.constant.WithdrawEnum;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Withdraw {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull(message = "sellerId cannot be null")
    private Long sellerId;
    @NotNull(message = "amount cannot be null")
    private long amount;
    @Enumerated(EnumType.STRING)
    private WithdrawEnum status;
    private String requestedAt;
    private String processedAt;

    @PrePersist
    public void prePersist() {
        this.requestedAt = java.time.LocalDateTime.now().toString();
    }
}
