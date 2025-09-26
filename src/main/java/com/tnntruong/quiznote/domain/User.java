package com.tnntruong.quiznote.domain;

import java.time.Instant;
import com.tnntruong.quiznote.util.constant.GenderEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {
    public static String PasswordEncoder = null;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @NotBlank(message = "name not be blanked")
    private String name;
    @NotBlank(message = "email khong duoc de trong")
    private String email;
    @NotBlank(message = "password khong duoc de trong")
    private String password;
    private int age;
    private String address;
    @Enumerated(EnumType.STRING)
    private GenderEnum gender;
    @Column(columnDefinition = "MEDIUMTEXT")
    // private String refreshToken;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

    // @PrePersist
    // public void handleCreate() {
    // this.createdAt = Instant.now();
    // this.createdBy = SecurityUtil.getCurrentUserLogin().isPresent() == true
    // ? SecurityUtil.getCurrentUserLogin().get()
    // : "";
    // }

    // @PreUpdate
    // public void handleUpdate() {
    // this.updatedAt = Instant.now();
    // this.updatedBy = SecurityUtil.getCurrentUserLogin().isPresent() == true
    // ? SecurityUtil.getCurrentUserLogin().get()
    // : "";
    // }
}
