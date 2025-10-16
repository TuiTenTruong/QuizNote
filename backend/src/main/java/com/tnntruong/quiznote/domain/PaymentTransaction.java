package com.tnntruong.quiznote.domain;

import java.time.Instant;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "payment_transactions")
@Getter
@Setter
public class PaymentTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String transactionNo; // vnp_TransactionNo
    private String orderInfo; // vnp_OrderInfo
    private String paymentTime; // vnp_PayDate
    private Long amount; // vnp_Amount / 100
    private String status; // SUCCESS, FAILED
    private String paymentMethod; // "VNPAY"

    @ManyToOne
    @JoinColumn(name = "buyer_id")
    private User buyer;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    private Instant createdAt;
}
