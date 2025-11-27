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
import org.springframework.security.crypto.password.PasswordEncoder;
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

import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.dto.request.ReqChangePasswordDTO;
import com.tnntruong.quiznote.dto.request.ReqChangeStatusUserDTO;
import com.tnntruong.quiznote.dto.request.ReqUpdateProfileDTO;
import com.tnntruong.quiznote.service.FileService;
import com.tnntruong.quiznote.service.UserService;
import com.tnntruong.quiznote.util.SecurityUtil;
import com.tnntruong.quiznote.util.annotation.ApiMessage;
import com.tnntruong.quiznote.util.error.InvalidException;
import com.tnntruong.quiznote.util.error.StorageException;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    private final PasswordEncoder passwordEncoder;
    private UserService userService;
    private FileService fileService;
    @Value("${quiznote.upload-file.base-uri}")
    private String baseURI;

    public UserController(UserService userService, PasswordEncoder passwordEncoder, FileService fileService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.fileService = fileService;
    }

    @PostMapping("/users")
    @ApiMessage("User created successfully")
    public ResponseEntity<?> postCreateUser(@RequestBody @Valid User newUser)
            throws InvalidException, URISyntaxException {
        boolean isEmailExist = this.userService.isEmailExist(newUser.getEmail());
        if (isEmailExist) {
            throw new InvalidException("email has exist");
        }
        String hashPassword = passwordEncoder.encode(newUser.getPassword());
        newUser.setPassword(hashPassword);
        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.handleCreateUser(newUser, null));
    }

    @PostMapping(value = "/users/{email}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiMessage("Avatar uploaded successfully")
    public ResponseEntity<?> uploadAvatar(@PathVariable String email,
            @RequestPart(name = "file", required = true) MultipartFile file)
            throws InvalidException, StorageException, IOException, URISyntaxException {
        User updateUser = this.userService.handleGetUserByUsername(email);

        if (file == null || file.isEmpty()) {
            throw new InvalidException("file is required");
        }
        String fileName = file.getOriginalFilename();
        List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png");
        boolean isValid = allowedExtensions.stream().anyMatch(item -> fileName.toLowerCase().endsWith(item));

        if (!isValid) {
            throw new StorageException("File không hợp lệ. Chỉ cho phép  " + allowedExtensions.toString());
        }
        this.fileService.createDirectory(baseURI + "/users");
        String stored = this.fileService.store(file, "/users"); // có thể là relative path hoặc filename
        updateUser.setAvatarUrl(stored);

        return ResponseEntity.ok().body(this.userService.handleUpdateUser(updateUser));
    }

    @PutMapping("/users")
    @ApiMessage("User updated successfully")
    public ResponseEntity<?> putUpdateUser(@RequestBody User updateUser) throws InvalidException {
        return ResponseEntity.ok().body(this.userService.handleUpdateUser(updateUser));
    }

    @DeleteMapping("/users/{id}")
    @ApiMessage("User deleted successfully")
    public ResponseEntity<?> deleteUser(@PathVariable String id) throws InvalidException {
        this.userService.handleDeleteUser(id);
        return ResponseEntity.ok("deleted");
    }

    @GetMapping("/users/{id}")
    @ApiMessage("Get user by id")
    public ResponseEntity<?> getUserById(@PathVariable String id) throws InvalidException {
        return ResponseEntity.ok().body(this.userService.handleGetUserById(id));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUser(@Filter Specification<User> spec, Pageable page) {
        return ResponseEntity.ok().body(this.userService.handleGetAllUser(spec, page));
    }

    @PutMapping("/users/profile")
    @ApiMessage("Update profile successfully")
    public ResponseEntity<?> updateProfile(@RequestBody ReqUpdateProfileDTO req)
            throws InvalidException {
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InvalidException("User not authenticated"));

        return ResponseEntity.ok().body(this.userService.handleUpdateProfile(
                email, req.getName(), req.getAge(), req.getAddress(), req.getGender(), req.getBio()));
    }

    @PostMapping("/users/change-password")
    @ApiMessage("Password changed successfully")
    public ResponseEntity<?> changePassword(@RequestBody ReqChangePasswordDTO req)
            throws InvalidException {
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InvalidException("User not authenticated"));

        this.userService.handleChangePassword(email, req.getCurrentPassword(), req.getNewPassword(), passwordEncoder);
        return ResponseEntity.ok().body("Password changed successfully");
    }

    @GetMapping("/users/me")
    @ApiMessage("Get current user")
    public ResponseEntity<?> getCurrentUser() throws InvalidException {
        String email = com.tnntruong.quiznote.util.SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new InvalidException("User not authenticated"));

        User currentUser = this.userService.handleGetUserByUsername(email);
        if (currentUser == null) {
            throw new InvalidException("User not found");
        }
        return ResponseEntity.ok().body(this.userService.convertUsertoDTO(currentUser));
    }

    @PostMapping("/users/changeStatus")
    @ApiMessage("User status changed successfully")
    public ResponseEntity<?> changeStatusUser(@RequestBody ReqChangeStatusUserDTO req) throws InvalidException {

        return ResponseEntity.ok().body(this.userService.changeStatusUser(req));
    }
}