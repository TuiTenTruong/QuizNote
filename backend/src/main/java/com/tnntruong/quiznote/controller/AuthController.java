package com.tnntruong.quiznote.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.service.UserService;
import com.tnntruong.quiznote.service.request.ReqLoginDTO;
import com.tnntruong.quiznote.service.response.ResLoginDTO;
import com.tnntruong.quiznote.util.SecurityUtil;
import com.tnntruong.quiznote.util.annotation.ApiMessage;
import com.tnntruong.quiznote.util.error.InvalidException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class AuthController {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtil securityUtil;
    private final UserService userService;
    @Value("${quiznote.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;
    private PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder, SecurityUtil securityUtil,
            UserService userService, PasswordEncoder passwordEncoder) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtil = securityUtil;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody ReqLoginDTO loginDto) {
        // Nạp input gồm username/password vào Security
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginDto.getUsername(), loginDto.getPassword());
        // xác thực người dùng => cần viết hàm loadUserByUsername
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // create a token
        SecurityContextHolder.getContext().setAuthentication(authentication);
        ResLoginDTO res = new ResLoginDTO();
        User currentUser = this.userService.handleGetUserByUsername(loginDto.getUsername());
        if (currentUser != null) {
            ResLoginDTO.UserLogin user = new ResLoginDTO.UserLogin(currentUser.getId(), currentUser.getName(),
                    currentUser.getEmail(), currentUser.getRole());
            res.setUser(user);
        }
        String accessToken = this.securityUtil.createAccessToken(authentication.getName(), res);
        res.setAccessToken(accessToken);

        // create refesh token
        String refeshToken = this.securityUtil.createRefreshToken(loginDto.getUsername(), res);
        // update user
        this.userService.updateUserToken(refeshToken, loginDto.getUsername());
        // set cookies
        ResponseCookie responseCookie = ResponseCookie.from("refreshCookie", refeshToken)
                .httpOnly(true)
                .secure(true)
                .maxAge(refreshTokenExpiration)
                .path("/")
                .build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie.toString()).body(res);
    }

    @GetMapping("/auth/account")
    @ApiMessage("fetch account")
    public ResponseEntity<ResLoginDTO.UserGetAccount> getAccunt() {
        String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get() : "";
        User currentUser = this.userService.handleGetUserByUsername(email);
        ResLoginDTO.UserLogin user = new ResLoginDTO.UserLogin();
        ResLoginDTO.UserGetAccount userGetAccount = new ResLoginDTO.UserGetAccount();
        if (currentUser != null) {
            user.setId(currentUser.getId());
            user.setEmail(currentUser.getEmail());
            user.setName(currentUser.getName());
            user.setRole(currentUser.getRole());
            userGetAccount.setUser(user);
        }
        return ResponseEntity.ok().body(userGetAccount);
    }

    @GetMapping("/auth/refresh")
    @ApiMessage("Get User by refresh token")
    public ResponseEntity<ResLoginDTO> getRefreshToken(
            @CookieValue(name = "refreshCookie", defaultValue = "abc") String refreshCookie)
            throws InvalidException {
        if (refreshCookie.equals("abc")) {
            throw new InvalidException("ban khong co refresh token o cookie");
        }
        Jwt decodedToken = this.securityUtil.checkValidRefreshToken(refreshCookie);
        String email = decodedToken.getSubject();

        User currentUser = this.userService.getUserByRefreshTokenAndEmail(refreshCookie, email);
        if (currentUser == null) {
            throw new InvalidException("Refresh token khong hop le");
        }
        ResLoginDTO res = new ResLoginDTO();
        User currentUserDB = this.userService.handleGetUserByUsername(email);
        if (currentUserDB != null) {
            ResLoginDTO.UserLogin user = new ResLoginDTO.UserLogin(currentUserDB.getId(), currentUserDB.getName(),
                    currentUserDB.getEmail(), currentUser.getRole());
            res.setUser(user);
        }
        String accessToken = this.securityUtil.createAccessToken(email, res);
        res.setAccessToken(accessToken);

        // create refesh token
        String newRefeshToken = this.securityUtil.createRefreshToken(email, res);
        // update user
        this.userService.updateUserToken(newRefeshToken, email);
        // set cookies
        ResponseCookie responseCookie = ResponseCookie.from("refreshCookie", newRefeshToken)
                .httpOnly(true)
                .secure(true)
                .maxAge(refreshTokenExpiration)
                .path("/")
                .build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, responseCookie.toString()).body(res);
    }

    @PostMapping("/auth/logout")
    @ApiMessage("logout success")
    public ResponseEntity<Void> handleLogout() throws InvalidException {
        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true ? SecurityUtil.getCurrentUserLogin().get()
                : null;
        if (email.equals("")) {
            throw new InvalidException("access token khoong hop le");
        }

        this.userService.updateUserToken(null, email);

        ResponseCookie deleteSpringCookie = ResponseCookie.from("refreshCookie", null)
                .httpOnly(true)
                .secure(true)
                .maxAge(0)
                .path("/")
                .build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, deleteSpringCookie.toString()).body(null);
    }

}
