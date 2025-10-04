package com.tnntruong.quiznote.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.service.UserService;
import com.tnntruong.quiznote.util.error.InvalidException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final PasswordEncoder passwordEncoder;
    private UserService userService;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/users")
    public ResponseEntity<?> postCreateUser(@Valid @RequestBody User newUser) throws InvalidException {
        boolean isEmailExist = this.userService.isEmailExist(newUser.getEmail());
        if (isEmailExist) {
            throw new InvalidException("email has exist");
        }
        String hashPassword = passwordEncoder.encode(newUser.getPassword());
        newUser.setPassword(hashPassword);
        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.handleCreateUser(newUser));
    }

    @PutMapping("/users")
    public ResponseEntity<?> putUpdateUser(@RequestBody User updateUser) throws InvalidException {
        return ResponseEntity.ok().body(this.userService.handleUpdateUser(updateUser));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) throws InvalidException {
        this.userService.handleDeleteUser(id);
        return ResponseEntity.ok("deleted");
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) throws InvalidException {
        return ResponseEntity.ok().body(this.userService.handleGetUserById(id));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUser(@Filter Specification<User> spec, Pageable page) {
        return ResponseEntity.ok().body(this.userService.handleGetAllUser(spec, page));
    }

}