package com.tnntruong.quiznote.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.service.AdminService;
import com.tnntruong.quiznote.util.annotation.ApiMessage;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/analysis")
    public ResponseEntity<?> getAdminAnalytics() {
        return ResponseEntity.ok(adminService.getAdminAnalytics());
    }

    @GetMapping("/orders")
    @ApiMessage("Fetched all orders successfully")
    public ResponseEntity<?> getAllOrders() {
        return ResponseEntity.ok(adminService.getAllOrders());
    }

}
