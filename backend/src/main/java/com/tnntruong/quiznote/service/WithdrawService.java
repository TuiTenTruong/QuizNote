package com.tnntruong.quiznote.service;

import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.SellerProfile;
import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.domain.Withdraw;
import com.tnntruong.quiznote.dto.request.ReqCreateWithdrawDTO;
import com.tnntruong.quiznote.repository.SellerProfileRepository;
import com.tnntruong.quiznote.repository.UserRepository;
import com.tnntruong.quiznote.repository.WithdrawRepository;
import com.tnntruong.quiznote.util.constant.WithdrawEnum;
import com.tnntruong.quiznote.util.error.InvalidException;

@Service
public class WithdrawService {
    private final UserRepository userRepository;
    private final WithdrawRepository withdrawRepository;
    private final SellerProfileRepository sellerProfileRepository;

    public WithdrawService(UserRepository userRepository, WithdrawRepository withdrawRepository,
            SellerProfileRepository sellerProfileRepository) {
        this.userRepository = userRepository;
        this.withdrawRepository = withdrawRepository;
        this.sellerProfileRepository = sellerProfileRepository;
    }

    public boolean withdraw(ReqCreateWithdrawDTO req) throws InvalidException {
        User seller = userRepository.findById(req.getSellerId())
                .orElseThrow(() -> new InvalidException("Seller not found"));
        SellerProfile profile = sellerProfileRepository.findBySeller(seller)
                .orElseThrow(() -> new InvalidException("Seller profile not found"));
        if (profile.getAvailableBalance() < req.getAmount()) {
            throw new InvalidException("Insufficient balance");
        }

        profile.setAvailableBalance(profile.getAvailableBalance() - req.getAmount());
        profile.setPendingWithdraw(profile.getPendingWithdraw() + req.getAmount());
        sellerProfileRepository.save(profile);

        Withdraw withdraw = new Withdraw();
        withdraw.setSellerId(req.getSellerId());
        withdraw.setAmount(req.getAmount());
        withdraw.setStatus(WithdrawEnum.PENDING);
        withdrawRepository.save(withdraw);

        return true;

    }

}
