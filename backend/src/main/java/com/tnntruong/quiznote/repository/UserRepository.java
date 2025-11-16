package com.tnntruong.quiznote.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tnntruong.quiznote.domain.User;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    boolean existsByEmail(String email);

    User findByEmail(String email);

    User findByRefreshTokenAndEmail(String token, String email);

    @Query("SELECT count(u) FROM User u WHERE u.createdAt >= :startDate")
    long countUsersRegisteredAfter(@Param("startDate") Instant startDate);

    @Query("SELECT u.role.name, COUNT(u) FROM User u GROUP BY u.role.name")
    List<Object[]> countUsersByRole();
}
