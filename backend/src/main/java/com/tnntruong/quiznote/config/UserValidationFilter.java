package com.tnntruong.quiznote.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
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
public class UserValidationFilter extends OncePerRequestFilter {

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Kiểm tra nếu user đã authenticated
        if (authentication != null && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof Jwt) {

            Jwt jwt = (Jwt) authentication.getPrincipal();
            String email = jwt.getSubject();

            if (email != null && !email.isEmpty()) {
                // Kiểm tra user có tồn tại và còn active không
                User user = userService.handleGetUserByUsername(email);

                if (user == null) {
                    // User đã bị xóa - xóa authentication và trả về 401
                    SecurityContextHolder.clearContext();
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write(
                            "{\"error\":\"User not found\",\"message\":\"Tài khoản không tồn tại hoặc đã bị xóa.\"}");
                    return;
                }

                if (!user.isActive()) {
                    // User bị vô hiệu hóa - xóa authentication và trả về 403
                    SecurityContextHolder.clearContext();
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write(
                            "{\"error\":\"Account disabled\",\"message\":\"Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.\"}");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
