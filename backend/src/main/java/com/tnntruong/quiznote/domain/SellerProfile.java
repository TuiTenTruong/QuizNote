package com.tnntruong.quiznote.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "seller_profiles")
@Getter
@Setter
public class SellerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String bankName;
    private String bankAccount;
    private Long totalRevenue = 0L;
    private Long pendingBalance = 0L;
    private Long pendingWithdraw = 0L;
    private Long availableBalance = 0L;

    @OneToOne
    @JoinColumn(name = "seller_id", referencedColumnName = "id")
    private User seller;
}
