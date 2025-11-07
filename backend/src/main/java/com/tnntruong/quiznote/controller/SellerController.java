package com.tnntruong.quiznote.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.service.SellerService;
import com.tnntruong.quiznote.util.annotation.ApiMessage;
import com.tnntruong.quiznote.util.error.InvalidException;

@RestController
@RequestMapping("/api/v1/seller")
public class SellerController {
    private final SellerService sellerService;

    public SellerController(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    @GetMapping("/analytics/{sellerId}")
    @ApiMessage("Get seller analytics")
    public ResponseEntity<?> getSellerAnalytics(
            @PathVariable Long sellerId,
            @RequestParam(required = false) Integer months) throws InvalidException {
        return ResponseEntity.ok(this.sellerService.getSellerAnalytics(sellerId, months));
    }
}
