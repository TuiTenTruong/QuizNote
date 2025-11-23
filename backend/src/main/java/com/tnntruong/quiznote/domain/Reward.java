package com.tnntruong.quiznote.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.tnntruong.quiznote.util.SecurityUtil;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "rewards")
public class Reward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "Tên quà không được để trống")
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    @NotNull(message = "Giá xu không được để trống")
    private int cost;

    private int stockQuantity = 0;

    private boolean inStock = true;

    private boolean isActive = true;

    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

    @OneToMany(mappedBy = "reward", fetch = FetchType.LAZY)
    private List<RewardTransaction> transactions = new ArrayList<>();

    @PrePersist
    public void handleCreate() {
        this.createdAt = Instant.now();
        this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "anonymous";
    }

    @PreUpdate
    public void handleUpdate() {
        this.updatedAt = Instant.now();
        this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent()
                ? SecurityUtil.getCurrentUserLogin().get()
                : "anonymous";
    }
}
