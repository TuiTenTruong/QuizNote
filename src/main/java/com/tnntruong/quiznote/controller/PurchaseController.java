package com.tnntruong.quiznote.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.service.PurchaseService;
import com.tnntruong.quiznote.service.request.ReqCreatePurchaseDTO;
import com.tnntruong.quiznote.util.error.InvalidException;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1")
public class PurchaseController {
    private PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping("/purchases")
    public ResponseEntity<?> createPurchase(@Valid @RequestBody ReqCreatePurchaseDTO purchase) throws InvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.purchaseService.handleCreatePurchase(purchase));
    }

    @GetMapping("/purchases/user/{userId}")
    public ResponseEntity<?> getPurchaseByUserId(@PathVariable String userId) throws InvalidException {
        return ResponseEntity.ok(this.purchaseService.hanldeGetPurchaseByUserId(userId));
    }

    @GetMapping("/purchases/subject/{subjectId}")
    public ResponseEntity<?> getPurchaseBySubjectId(@PathVariable String subjectId) throws InvalidException {
        return ResponseEntity.ok(this.purchaseService.hanldeGetPurchaseBySubjectId(subjectId));
    }

    @GetMapping("/purchases/{id}")
    public ResponseEntity<?> getPurchaseById(@PathVariable String id) throws InvalidException {
        return ResponseEntity.ok(this.purchaseService.handleGetPurchaseById(id));
    }

    @DeleteMapping("/purchases/{id}")
    public ResponseEntity<?> deletePurchaseById(@PathVariable String id) throws InvalidException {
        return ResponseEntity.ok("deleted purchase");
    }

}
