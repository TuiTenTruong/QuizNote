package com.tnntruong.quiznote.service;

import com.tnntruong.quiznote.domain.SellerProfile;
import com.tnntruong.quiznote.repository.SellerProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SellerBalanceScheduler {

    private final SellerProfileRepository sellerProfileRepository;

    // Chạy vào 00:00 mỗi thứ Tư (cron: giây phút giờ ngày tháng thứ)
    @Scheduled(cron = "0 0 0 * * WED")
    @Transactional
    public void transferPendingBalanceToAvailable() {
        log.info("Starting weekly balance transfer process...");

        List<SellerProfile> sellers = sellerProfileRepository.findAll();
        int processedCount = 0;

        for (SellerProfile seller : sellers) {
            if (seller.getPendingBalance() > 0) {
                Long pendingAmount = seller.getPendingBalance();
                seller.setAvailableBalance(seller.getAvailableBalance() + pendingAmount);
                seller.setPendingBalance(0L);
                sellerProfileRepository.save(seller);
                processedCount++;

                log.info("Transferred {} from pending to available for seller ID: {}",
                        pendingAmount, seller.getId());
            }
        }

        log.info("Weekly balance transfer completed. Processed {} sellers.", processedCount);
    }
}
