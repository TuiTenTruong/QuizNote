package com.tnntruong.quiznote.config;

import java.io.IOException;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SessionValidationFilter extends OncePerRequestFilter {

    private final UserService userService;

    public SessionValidationFilter(UserService userService) {
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Skip validation for refresh endpoint
        String requestPath = request.getRequestURI();
        if (requestPath.contains("/auth/refresh")) {
            filterChain.doFilter(request, response);
            return;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            String email = jwt.getSubject();
            String sessionIdFromToken = jwt.getClaim("sessionId");

            if (email != null && sessionIdFromToken != null) {
                Optional<User> userOptional = this.userService.handleGetUserByEmail(email);

                // User không tồn tại
                if (userOptional.isEmpty()) {
                    SecurityContextHolder.clearContext();
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().write(
                            "{\"error\":\"User not found\",\"message\":\"Tài khoản không tồn tại hoặc đã bị xóa.\"}");
                    return;
                }

                User user = userOptional.get();

                // User bị vô hiệu hóa
                if (!user.isActive()) {
                    SecurityContextHolder.clearContext();
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().write(
                            "{\"error\":\"Account disabled\",\"message\":\"Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.\"}");
                    return;
                }

                // SessionId không khớp (đã đăng nhập ở thiết bị khác)
                if (user.getSessionId() == null || !user.getSessionId().equals(sessionIdFromToken)) {
                    SecurityContextHolder.clearContext();
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().write(
                            "{\"error\":\"Session expired\",\"message\":\"Tài khoản đã đăng nhập ở thiết bị khác hoặc phiên đã hết hạn\"}");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
