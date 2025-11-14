package com.tnntruong.quiznote.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tnntruong.quiznote.domain.SellerProfile;
import com.tnntruong.quiznote.domain.User;

@Repository
public interface SellerProfileRepository extends JpaRepository<SellerProfile, Long> {
    Optional<SellerProfile> findBySeller(User user);
}
