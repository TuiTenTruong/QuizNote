package com.tnntruong.quiznote.config;

import java.util.List;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import com.tnntruong.quiznote.domain.Permission;
import com.tnntruong.quiznote.domain.Role;
import com.tnntruong.quiznote.domain.User;
import com.tnntruong.quiznote.service.UserService;
import com.tnntruong.quiznote.util.SecurityUtil;
import com.tnntruong.quiznote.util.error.PermissionException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class PermissionInterceptor implements HandlerInterceptor {
    private final UserService userService;

    public PermissionInterceptor(UserService userService) {
        this.userService = userService;
    }

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response, Object handler)
            throws Exception {
        String path = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        String requestURI = request.getRequestURI();
        String httpMethod = request.getMethod();
        System.out.println(">>> RUN preHandle");
        System.out.println(">>> path= " + path);
        System.out.println(">>> httpMethod= " + httpMethod);
        System.out.println(">>> requestURI= " + requestURI);
        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true ? SecurityUtil.getCurrentUserLogin().get()
                : "";

        if (email != null && !email.isEmpty()) {
            User user = this.userService.handleGetUserByUsername(email);
            if (user != null) {
                Role role = user.getRole();
                if (role != null) {
                    List<Permission> permissions = role.getPermissions();
                    boolean isAllow = permissions.stream()
                            .anyMatch(items -> items.getApiPath().equals(path) && items.getMethod().equals(httpMethod));
                    if (isAllow == false) {
                        throw new PermissionException("You do not have access to this endpoint");
                    }
                } else {
                    throw new PermissionException("You do not have access to this endpoint");
                }
            }
        }
        return true;
    }
}