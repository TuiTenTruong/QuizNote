package com.tnntruong.quiznote.controller;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tnntruong.quiznote.domain.Reward;
import com.tnntruong.quiznote.domain.RewardTransaction;
import com.tnntruong.quiznote.dto.request.reward.ReqCreateRewardDTO;
import com.tnntruong.quiznote.dto.request.reward.ReqRedeemRewardDTO;
import com.tnntruong.quiznote.dto.request.reward.ReqUpdateRewardDTO;
import com.tnntruong.quiznote.dto.request.reward.ReqUpdateTransactionStatusDTO;
import com.tnntruong.quiznote.dto.response.ResResultPagination;
import com.tnntruong.quiznote.dto.response.reward.ResRewardDTO;
import com.tnntruong.quiznote.dto.response.reward.ResRewardTransactionDTO;
import com.tnntruong.quiznote.service.FileService;
import com.tnntruong.quiznote.service.RewardService;
import com.tnntruong.quiznote.util.annotation.ApiMessage;
import com.tnntruong.quiznote.util.error.InvalidException;
import com.tnntruong.quiznote.util.error.StorageException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/rewards")
public class RewardController {
    private final RewardService rewardService;
    private final FileService fileService;
    @Value("${quiznote.upload-file.base-uri}")
    private String baseURI;

    public RewardController(RewardService rewardService, FileService fileService) {
        this.rewardService = rewardService;
        this.fileService = fileService;
    }

    @GetMapping("/available")
    @ApiMessage("Lấy danh sách quà khả dụng")
    public ResponseEntity<List<ResRewardDTO>> getAvailableRewards() {
        List<ResRewardDTO> rewards = rewardService.getAvailableRewards();
        return ResponseEntity.ok(rewards);
    }

    // User: Redeem reward
    @PostMapping("/redeem")
    @ApiMessage("Đổi quà thành công")
    public ResponseEntity<ResRewardTransactionDTO> redeemReward(@Valid @RequestBody ReqRedeemRewardDTO dto)
            throws InvalidException {
        ResRewardTransactionDTO transaction = rewardService.redeemReward(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
    }

    // User: Get my transaction history
    @GetMapping("/my-transactions")
    @ApiMessage("Lấy lịch sử đổi quà")
    public ResponseEntity<ResResultPagination> getMyTransactions(Pageable pageable) throws InvalidException {
        ResResultPagination result = rewardService.getMyTransactions(pageable);
        return ResponseEntity.ok(result);
    }

    // Admin: Create reward
    @PostMapping(value = "", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @ApiMessage("Tạo quà mới thành công")
    public ResponseEntity<ResRewardDTO> createReward(@Valid @RequestPart(name = "reward") ReqCreateRewardDTO dto,
            @RequestPart(name = "image", required = false) MultipartFile image)
            throws InvalidException, URISyntaxException, IOException, StorageException {
        String stored = null;
        if (image != null) {
            String fileName = image.getOriginalFilename();
            List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png");
            boolean isValid = allowedExtensions.stream().anyMatch(item -> fileName.toLowerCase().endsWith(item));

            if (!isValid) {
                throw new StorageException("File không hợp lệ. Chỉ cho phép  " + allowedExtensions.toString());
            }
            this.fileService.createDirectory(baseURI + "rewards");
            stored = this.fileService.store(image, "rewards");
        }
        ResRewardDTO reward = rewardService.createReward(dto, stored);
        return ResponseEntity.status(HttpStatus.CREATED).body(reward);
    }

    // Admin: Update reward
    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @ApiMessage("Cập nhật quà thành công")
    public ResponseEntity<ResRewardDTO> updateReward(@PathVariable long id,
            @Valid @RequestPart("reward") ReqUpdateRewardDTO dto,
            @RequestPart(name = "image", required = false) MultipartFile image)
            throws InvalidException, URISyntaxException, IOException, StorageException {
        String stored = null;
        if (image != null) {
            String fileName = image.getOriginalFilename();
            List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png");
            boolean isValid = allowedExtensions.stream().anyMatch(item -> fileName.toLowerCase().endsWith(item));

            if (!isValid) {
                throw new StorageException("File không hợp lệ. Chỉ cho phép  " + allowedExtensions.toString());
            }
            this.fileService.createDirectory(baseURI + "rewards");
            stored = this.fileService.store(image, "rewards");
        }
        ResRewardDTO reward = rewardService.updateReward(id, dto, stored);
        return ResponseEntity.ok(reward);
    }

    // Admin: Delete reward
    @DeleteMapping("/{id}")
    @ApiMessage("Xóa quà thành công")
    public ResponseEntity<?> deleteReward(@PathVariable long id) throws InvalidException {
        rewardService.deleteReward(id);
        return ResponseEntity.ok("deleted reward successfully");
    }

    // Admin: Get all rewards with pagination
    @GetMapping("")
    @ApiMessage("Lấy danh sách tất cả quà")
    public ResponseEntity<ResResultPagination> getAllRewards(
            @Filter Specification<Reward> spec,
            Pageable pageable) {
        ResResultPagination result = rewardService.getAllRewards(spec, pageable);
        return ResponseEntity.ok(result);
    }

    // Get single reward
    @GetMapping("/{id}")
    @ApiMessage("Lấy thông tin quà")
    public ResponseEntity<ResRewardDTO> getRewardById(@PathVariable long id) throws InvalidException {
        ResRewardDTO reward = rewardService.getRewardById(id);
        return ResponseEntity.ok(reward);
    }

    // Admin: Get all transactions
    @GetMapping("/transactions")
    @ApiMessage("Lấy danh sách tất cả giao dịch đổi quà")
    public ResponseEntity<ResResultPagination> getAllTransactions(
            @Filter Specification<RewardTransaction> spec,
            Pageable pageable) {
        ResResultPagination result = rewardService.getAllTransactions(spec, pageable);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/transactions/{id}/status")
    @ApiMessage("Cập nhật trạng thái giao dịch đổi quà")
    public ResponseEntity<ResRewardTransactionDTO> updateTransactionStatus(
            @PathVariable long id,
            @Valid @RequestBody ReqUpdateTransactionStatusDTO dto) throws InvalidException {
        ResRewardTransactionDTO transaction = rewardService.updateTransactionStatus(id, dto.getStatus());
        return ResponseEntity.ok(transaction);
    }
}
