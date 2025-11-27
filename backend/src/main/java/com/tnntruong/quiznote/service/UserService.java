package com.tnntruong.quiznote.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.tnntruong.quiznote.domain.Role;
import com.tnntruong.quiznote.domain.SellerProfile;
import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.dto.request.ReqChangeStatusUserDTO;
import com.tnntruong.quiznote.dto.response.ResResultPagination;
import com.tnntruong.quiznote.dto.response.user.ResCreateUserDTO;
import com.tnntruong.quiznote.dto.response.user.ResGetUserDTO;
import com.tnntruong.quiznote.dto.response.user.ResUpdateStatusDTO;
import com.tnntruong.quiznote.dto.response.user.ResUpdateUserDTO;
import com.tnntruong.quiznote.repository.CommentRepository;
import com.tnntruong.quiznote.repository.PaymentTransactionRepository;
import com.tnntruong.quiznote.repository.PurchaseRepository;
import com.tnntruong.quiznote.repository.SellerProfileRepository;
import com.tnntruong.quiznote.repository.SubjectRepository;
import com.tnntruong.quiznote.repository.SubmissionRepository;
import com.tnntruong.quiznote.repository.UserRepository;
import com.tnntruong.quiznote.repository.WithdrawRepository;
import com.tnntruong.quiznote.util.SecurityUtil;
import com.tnntruong.quiznote.util.error.InvalidException;
import jakarta.transaction.Transactional;

@Service
public class UserService {
    private UserRepository userRepository;
    private RoleService roleService;
    private SellerProfileRepository sellerProfileRepository;
    private SubmissionRepository submissionRepository;
    private PurchaseRepository purchaseRepository;
    private CommentRepository commentRepository;
    private PaymentTransactionRepository paymentTransactionRepository;
    private SubjectRepository subjectRepository;
    private WithdrawRepository withdrawRepository;
    @Value("${quiznote.upload-file.base-uri}")
    private String baseURI;

    public UserService(UserRepository userRepository, RoleService roleService,
            SellerProfileRepository sellerProfileRepository,
            SubmissionRepository submissionRepository,
            PurchaseRepository purchaseRepository,
            CommentRepository commentRepository,
            PaymentTransactionRepository paymentTransactionRepository,
            SubjectRepository subjectRepository,
            WithdrawRepository withdrawRepository) {
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.sellerProfileRepository = sellerProfileRepository;
        this.submissionRepository = submissionRepository;
        this.purchaseRepository = purchaseRepository;
        this.commentRepository = commentRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.subjectRepository = subjectRepository;
        this.withdrawRepository = withdrawRepository;
    }

    public boolean isEmailExist(String email) {
        return this.userRepository.existsByEmail(email);
    }

    public ResCreateUserDTO handleCreateUser(User user, String fileUrl) {
        return handleCreateUser(user, fileUrl, null, null);
    }

    public ResCreateUserDTO handleCreateUser(User user, String fileUrl, String bankName, String bankAccount) {
        if (user.getRole() != null) {
            Optional<Role> role = this.roleService.findById(user.getRole().getId());
            user.setRole(role.isPresent() ? role.get() : null);
        }
        if (fileUrl != null) {
            user.setAvatarUrl(baseURI + "/users/" + fileUrl);
        }
        User savedUser = this.userRepository.save(user);

        // Create seller profile if user is a seller
        if (savedUser.getRole() != null && "SELLER".equalsIgnoreCase(savedUser.getRole().getName())) {
            SellerProfile sellerProfile = new SellerProfile();
            sellerProfile.setSeller(savedUser);
            sellerProfile.setBankName(bankName != null ? bankName : "");
            sellerProfile.setBankAccount(bankAccount != null ? bankAccount : "");
            sellerProfile.setTotalRevenue(0L);
            sellerProfile.setPendingWithdraw(0L);
            sellerProfile.setAvailableBalance(0L);
            sellerProfileRepository.save(sellerProfile);
        }

        ResCreateUserDTO res = new ResCreateUserDTO();
        res.setId(savedUser.getId());
        res.setName(savedUser.getName());
        res.setEmail(savedUser.getEmail());
        res.setGender(savedUser.getGender());
        res.setAge(savedUser.getAge());
        res.setAvatarUrl(savedUser.getAvatarUrl());
        res.setCreatedAt(savedUser.getCreatedAt());
        res.setCreatedBy(savedUser.getCreatedBy());
        return res;
    }

    public ResUpdateUserDTO handleUpdateUser(User user) throws InvalidException {
        Optional<User> userOptional = this.userRepository.findById(user.getId());
        if (userOptional.isEmpty()) {
            throw new InvalidException("User with id = " + user.getId() + " not found");
        }
        User currentUser = userOptional.get();
        if (currentUser != null) {
            currentUser.setName(user.getName());
            currentUser.setAge(user.getAge());
            currentUser.setAddress(user.getAddress());
            currentUser.setGender(user.getGender());
            currentUser.setAvatarUrl(user.getAvatarUrl());
            if (user.getRole() != null) {
                Optional<Role> role = this.roleService.findById(user.getRole().getId());
                currentUser.setRole(role.isPresent() ? role.get() : null);
            }
            User savedUser = this.userRepository.save(currentUser);
            ResUpdateUserDTO res = new ResUpdateUserDTO();

            res.setId(savedUser.getId());
            res.setName(savedUser.getName());
            res.setEmail(savedUser.getEmail());
            res.setGender(savedUser.getGender());
            res.setAge(savedUser.getAge());
            res.setAvatarUrl(savedUser.getAvatarUrl());
            res.setUpdatedAt(savedUser.getUpdatedAt());
            res.setUpdatedBy(savedUser.getUpdatedBy());
            return res;
        }
        return null;
    }

    @Transactional
    public void handleDeleteUser(String id) throws InvalidException {
        try {
            Long idUser = Long.parseLong(id);
            boolean isExistById = this.userRepository.existsById(idUser);
            if (!isExistById) {
                throw new InvalidException("User with id = " + idUser + " not found");
            }

            // Xóa các bản ghi liên quan theo thứ tự để tránh vi phạm khóa ngoại
            // 1. Xóa submissions của user (student)
            submissionRepository.deleteByStudentId(idUser);

            // 2. Xóa comments của user
            commentRepository.deleteByUserId(idUser);

            // 3. Xóa payment transactions (as buyer và seller)
            paymentTransactionRepository.deleteByBuyerId(idUser);
            paymentTransactionRepository.deleteBySellerId(idUser);

            // 4. Xóa purchases (as student và seller)
            purchaseRepository.deleteByStudentId(idUser);
            purchaseRepository.deleteBySellerId(idUser);

            // 5. Xóa withdraws của seller
            withdrawRepository.deleteBySellerId(idUser);

            // 6. Xóa subjects của seller (sẽ xóa cascade questions, chapters)
            subjectRepository.deleteBySellerId(idUser);

            // 7. Cuối cùng xóa user (seller profile sẽ tự động xóa vì cascade =
            // CascadeType.ALL)
            this.userRepository.deleteById(idUser);
        } catch (NumberFormatException e) {
            throw new InvalidException("invalid id");
        }
    }

    public ResGetUserDTO convertUsertoDTO(User user) {
        ResGetUserDTO res = new ResGetUserDTO();
        ResGetUserDTO.RoleUser roleUser = new ResGetUserDTO.RoleUser();
        res.setId(user.getId());
        res.setName(user.getName());
        res.setEmail(user.getEmail());
        res.setGender(user.getGender());
        res.setAge(user.getAge());
        res.setAddress(user.getAddress());
        res.setAvatarUrl(user.getAvatarUrl());
        res.setBio(user.getBio());
        res.setActive(user.isActive());

        res.setCreatedAt(user.getCreatedAt());
        res.setCreatedBy(user.getCreatedBy());
        res.setUpdatedAt(user.getUpdatedAt());
        res.setUpdatedBy(user.getUpdatedBy());
        if (user.getRole() != null) {
            roleUser.setId(user.getRole().getId());
            roleUser.setName(user.getRole().getName());
            res.setRole(roleUser);
        }
        return res;
    }

    public ResGetUserDTO handleGetUserById(String id) throws InvalidException {
        try {
            Long idUser = Long.parseLong(id);
            Optional<User> dbUser = this.userRepository.findById(idUser);
            if (dbUser.isEmpty()) {
                throw new InvalidException("User with id = " + idUser + " now found");
            }
            return this.convertUsertoDTO(dbUser.get());

        } catch (NumberFormatException e) {
            throw new InvalidException("invalid id");

        }
    }

    public ResResultPagination handleGetAllUser(Specification<User> spec, Pageable page) {
        Page<User> userPage = this.userRepository.findAll(spec, page);
        List<ResGetUserDTO> listUser = userPage.getContent().stream().map(item -> this.convertUsertoDTO(item))
                .collect(Collectors.toList());
        ResResultPagination res = new ResResultPagination();
        ResResultPagination.Meta mt = new ResResultPagination.Meta();
        mt.setPage(userPage.getNumber() + 1);
        mt.setPageSize(userPage.getSize());
        mt.setPages(userPage.getTotalPages());
        mt.setTotal(userPage.getTotalElements());
        res.setMeta(mt);
        res.setResult(listUser);
        return res;
    }

    public User handleGetUserByUsername(String email) {
        return this.userRepository.findByEmail(email);
    }

    public User getUserByRefreshTokenAndEmail(String token, String email) {
        return this.userRepository.findByRefreshTokenAndEmail(token, email);
    }

    public void updateUserToken(String token, String email) {
        User currentUser = this.handleGetUserByUsername(email);
        if (currentUser != null) {
            currentUser.setRefreshToken(token);
            this.userRepository.save(currentUser);
        }
    }
    
    public void updateUserTokenAndSession(String token, String sessionId, String email) {
        User currentUser = this.handleGetUserByUsername(email);
        if (currentUser != null) {
            currentUser.setRefreshToken(token);
            currentUser.setSessionId(sessionId);
            this.userRepository.save(currentUser);
        }
    }
    
    public Optional<User> handleGetUserByEmail(String email) {
        User user = this.userRepository.findByEmail(email);
        return Optional.ofNullable(user);
    }

    public Role getDefaultRole() {
        return this.roleService.findById(2).orElseThrow(() -> new RuntimeException("Default USER role not found"));
    }

    public Role getRoleByName(String name) {
        return this.roleService.findByName(name);
    }

    public User handleGetCurrentUser() {
        String username = SecurityUtil.getCurrentUserLogin().get();
        return this.userRepository.findByEmail(username);
    }

    public ResUpdateUserDTO handleUpdateProfile(String email, String name, int age, String address,
            com.tnntruong.quiznote.util.constant.GenderEnum gender, String bio) throws InvalidException {
        User currentUser = this.userRepository.findByEmail(email);
        if (currentUser == null) {
            throw new InvalidException("User not found");
        }
        currentUser.setName(name);
        currentUser.setAge(age);
        currentUser.setAddress(address);
        currentUser.setGender(gender);
        currentUser.setBio(bio);

        User savedUser = this.userRepository.save(currentUser);

        ResUpdateUserDTO res = new ResUpdateUserDTO();
        res.setId(savedUser.getId());
        res.setName(savedUser.getName());
        res.setEmail(savedUser.getEmail());
        res.setGender(savedUser.getGender());
        res.setAge(savedUser.getAge());
        res.setAvatarUrl(savedUser.getAvatarUrl());
        res.setUpdatedAt(savedUser.getUpdatedAt());
        res.setUpdatedBy(savedUser.getUpdatedBy());
        return res;
    }

    public void handleChangePassword(String email, String currentPassword, String newPassword,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) throws InvalidException {
        User user = this.userRepository.findByEmail(email);
        if (user == null) {
            throw new InvalidException("User not found");
        }

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new InvalidException("Current password is incorrect");
        }

        String hashedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(hashedPassword);
        this.userRepository.save(user);
    }

    public ResUpdateStatusDTO changeStatusUser(ReqChangeStatusUserDTO req) throws InvalidException {
        User user = this.userRepository.findById(req.getId())
                .orElseThrow(() -> new InvalidException("User not found"));
        user.setActive(req.getStatus());
        this.userRepository.save(user);
        ResUpdateStatusDTO res = new ResUpdateStatusDTO();
        res.setId(user.getId());
        res.setStatus(user.isActive());
        return res;
    }
}
