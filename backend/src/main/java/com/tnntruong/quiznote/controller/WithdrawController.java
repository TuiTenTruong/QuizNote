package com.tnntruong.quiznote.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.dto.request.ReqCreateWithdrawDTO;
import com.tnntruong.quiznote.service.WithdrawService;
import com.tnntruong.quiznote.util.error.InvalidException;

@RestController
@RequestMapping("/api/v1")
public class WithdrawController {
    private final WithdrawService withdrawService;

    public WithdrawController(WithdrawService withdrawService) {
        this.withdrawService = withdrawService;
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody ReqCreateWithdrawDTO reqCreateWithdrawDTO) throws InvalidException {
        return ResponseEntity.ok().body(withdrawService.withdraw(reqCreateWithdrawDTO));
    }
}
