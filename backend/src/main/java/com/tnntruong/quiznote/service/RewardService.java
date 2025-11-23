package com.tnntruong.quiznote.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tnntruong.quiznote.domain.Reward;
import com.tnntruong.quiznote.domain.RewardTransaction;
import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.dto.request.reward.ReqCreateRewardDTO;
import com.tnntruong.quiznote.dto.request.reward.ReqRedeemRewardDTO;
import com.tnntruong.quiznote.dto.request.reward.ReqUpdateRewardDTO;
import com.tnntruong.quiznote.dto.response.ResResultPagination;
import com.tnntruong.quiznote.dto.response.reward.ResRewardDTO;
import com.tnntruong.quiznote.dto.response.reward.ResRewardTransactionDTO;
import com.tnntruong.quiznote.repository.RewardRepository;
import com.tnntruong.quiznote.repository.RewardTransactionRepository;
import com.tnntruong.quiznote.repository.UserRepository;
import com.tnntruong.quiznote.util.SecurityUtil;
import com.tnntruong.quiznote.util.constant.RewardTransactionStatus;
import com.tnntruong.quiznote.util.error.InvalidException;

@Service
public class RewardService {
    private final RewardRepository rewardRepository;
    private final RewardTransactionRepository rewardTransactionRepository;
    private final UserRepository userRepository;

    public RewardService(RewardRepository rewardRepository,
            RewardTransactionRepository rewardTransactionRepository,
            UserRepository userRepository) {
        this.rewardRepository = rewardRepository;
        this.rewardTransactionRepository = rewardTransactionRepository;
        this.userRepository = userRepository;
    }

    // Admin: Create reward
    public ResRewardDTO createReward(ReqCreateRewardDTO dto, String imageUrl) {
        Reward reward = new Reward();
        reward.setName(dto.getName());
        reward.setDescription(dto.getDescription());
        reward.setImageUrl(imageUrl);
        reward.setCost(dto.getCost());
        reward.setStockQuantity(dto.getStockQuantity());
        reward.setInStock(dto.isInStock());
        reward.setActive(true);

        reward = rewardRepository.save(reward);
        return convertToResRewardDTO(reward);
    }

    // Admin: Update reward
    public ResRewardDTO updateReward(long id, ReqUpdateRewardDTO dto, String imageUrl) throws InvalidException {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Không tìm thấy quà với id = " + id));

        if (dto.getName() != null) {
            reward.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            reward.setDescription(dto.getDescription());
        }
        if (imageUrl != null) {
            reward.setImageUrl(imageUrl);
        }
        if (dto.getCost() != null) {
            reward.setCost(dto.getCost());
        }
        if (dto.getStockQuantity() != null) {
            reward.setStockQuantity(dto.getStockQuantity());
        }
        if (dto.getInStock() != null) {
            reward.setInStock(dto.getInStock());
        }
        if (dto.getActive() != null) {
            reward.setActive(dto.getActive());
        }

        reward = rewardRepository.save(reward);
        return convertToResRewardDTO(reward);
    }

    // Admin: Delete reward
    @Transactional
    public void deleteReward(long id) throws InvalidException {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Không tìm thấy quà với id = " + id));

        // Kiểm tra nếu đã có giao dịch đổi quà thì chỉ chuyển sang inactive
        boolean hasTransactions = rewardTransactionRepository.existsByRewardId(id);
        if (hasTransactions) {
            reward.setActive(false);
            rewardRepository.save(reward);
        } else {
            rewardRepository.delete(reward);
        }
    }

    // Admin: Get all rewards (with pagination)
    public ResResultPagination getAllRewards(Specification<Reward> spec, Pageable pageable) {
        Page<Reward> pageReward = rewardRepository.findAll(spec, pageable);
        ResResultPagination res = new ResResultPagination();
        ResResultPagination.Meta meta = new ResResultPagination.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageReward.getTotalPages());
        meta.setTotal(pageReward.getTotalElements());

        res.setMeta(meta);
        List<ResRewardDTO> list = pageReward.getContent()
                .stream()
                .map(this::convertToResRewardDTO)
                .collect(Collectors.toList());
        res.setResult(list);
        return res;
    }

    // User: Get available rewards (active & in stock)
    public List<ResRewardDTO> getAvailableRewards() {
        List<Reward> rewards = rewardRepository.findByInStockTrueAndIsActiveTrue();
        return rewards.stream()
                .map(this::convertToResRewardDTO)
                .collect(Collectors.toList());
    }

    // User: Redeem reward
    @Transactional
    public ResRewardTransactionDTO redeemReward(ReqRedeemRewardDTO dto) throws InvalidException {
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InvalidException("Không tìm thấy người dùng hiện tại"));

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new InvalidException("Không tìm thấy người dùng");
        }

        Reward reward = rewardRepository.findById(dto.getRewardId())
                .orElseThrow(() -> new InvalidException("Không tìm thấy quà với id = " + dto.getRewardId()));

        // Check if reward is available
        if (!reward.isActive()) {
            throw new InvalidException("Quà này không còn khả dụng");
        }

        if (!reward.isInStock()) {
            throw new InvalidException("Quà này đã hết hàng");
        }

        // Check if user has enough coins
        if (user.getCoins() < reward.getCost()) {
            throw new InvalidException("Bạn không đủ xu để đổi quà này. Cần " + reward.getCost() + " xu, bạn có "
                    + user.getCoins() + " xu");
        }

        // Check stock quantity
        if (reward.getStockQuantity() > 0) {
            reward.setStockQuantity(reward.getStockQuantity() - 1);
            if (reward.getStockQuantity() == 0) {
                reward.setInStock(false);
            }
        }

        // Deduct coins from user
        user.setCoins(user.getCoins() - reward.getCost());
        userRepository.save(user);
        rewardRepository.save(reward);

        // Create transaction
        RewardTransaction transaction = new RewardTransaction();
        transaction.setUser(user);
        transaction.setReward(reward);
        transaction.setCoinsCost(reward.getCost());
        transaction.setStatus(RewardTransactionStatus.PENDING);
        transaction.setDeliveryInfo(
                "Name: " + dto.getRecipientName() + ", Phone: " + dto.getRecipientPhone() + ", Address: "
                        + dto.getRecipientAddress());

        transaction = rewardTransactionRepository.save(transaction);
        return convertToResRewardTransactionDTO(transaction);
    }

    // User: Get transaction history
    public ResResultPagination getMyTransactions(Pageable pageable) throws InvalidException {
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InvalidException("Không tìm thấy người dùng hiện tại"));

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new InvalidException("Không tìm thấy người dùng");
        }

        Page<RewardTransaction> pageTransaction = rewardTransactionRepository.findByUser(user, pageable);
        ResResultPagination res = new ResResultPagination();
        ResResultPagination.Meta meta = new ResResultPagination.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageTransaction.getTotalPages());
        meta.setTotal(pageTransaction.getTotalElements());

        res.setMeta(meta);
        List<ResRewardTransactionDTO> list = pageTransaction.getContent()
                .stream()
                .map(this::convertToResRewardTransactionDTO)
                .collect(Collectors.toList());
        res.setResult(list);
        return res;
    }

    // Admin: Get all transactions
    public ResResultPagination getAllTransactions(Specification<RewardTransaction> spec, Pageable pageable) {
        Page<RewardTransaction> pageTransaction = rewardTransactionRepository.findAll(spec, pageable);
        ResResultPagination res = new ResResultPagination();
        ResResultPagination.Meta meta = new ResResultPagination.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setPages(pageTransaction.getTotalPages());
        meta.setTotal(pageTransaction.getTotalElements());

        res.setMeta(meta);
        List<ResRewardTransactionDTO> list = pageTransaction.getContent()
                .stream()
                .map(this::convertToResRewardTransactionDTO)
                .collect(Collectors.toList());
        res.setResult(list);
        return res;
    }

    // Get single reward by ID
    public ResRewardDTO getRewardById(long id) throws InvalidException {
        Reward reward = rewardRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Không tìm thấy quà với id = " + id));
        return convertToResRewardDTO(reward);
    }

    // Convert entities to DTOs
    private ResRewardDTO convertToResRewardDTO(Reward reward) {
        ResRewardDTO dto = new ResRewardDTO();
        dto.setId(reward.getId());
        dto.setName(reward.getName());
        dto.setDescription(reward.getDescription());
        dto.setImageUrl(reward.getImageUrl());
        dto.setCost(reward.getCost());
        dto.setStockQuantity(reward.getStockQuantity());
        dto.setInStock(reward.isInStock());
        dto.setActive(reward.isActive());
        dto.setCreatedAt(reward.getCreatedAt());
        dto.setUpdatedAt(reward.getUpdatedAt());
        return dto;
    }

    private ResRewardTransactionDTO convertToResRewardTransactionDTO(RewardTransaction transaction) {
        ResRewardTransactionDTO dto = new ResRewardTransactionDTO();
        dto.setId(transaction.getId());
        dto.setCoinsCost(transaction.getCoinsCost());
        dto.setStatus(transaction.getStatus());
        dto.setDeliveryInfo(transaction.getDeliveryInfo());
        dto.setRedeemedAt(transaction.getRedeemedAt());

        // User info
        ResRewardTransactionDTO.UserInfo userInfo = new ResRewardTransactionDTO.UserInfo();
        userInfo.setId(transaction.getUser().getId());
        userInfo.setName(transaction.getUser().getName());
        userInfo.setEmail(transaction.getUser().getEmail());
        dto.setUser(userInfo);

        // Reward info
        ResRewardTransactionDTO.RewardInfo rewardInfo = new ResRewardTransactionDTO.RewardInfo();
        rewardInfo.setId(transaction.getReward().getId());
        rewardInfo.setName(transaction.getReward().getName());
        rewardInfo.setImageUrl(transaction.getReward().getImageUrl());
        dto.setReward(rewardInfo);

        return dto;
    }

    public ResRewardTransactionDTO updateTransactionStatus(long id, String status) throws InvalidException {
        RewardTransaction transaction = rewardTransactionRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Không tìm thấy giao dịch với id = " + id));

        try {
            RewardTransactionStatus newStatus = RewardTransactionStatus.valueOf(status);
            transaction.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new InvalidException("Trạng thái không hợp lệ: " + status);
        }

        transaction = rewardTransactionRepository.save(transaction);
        return convertToResRewardTransactionDTO(transaction);
    }
}
