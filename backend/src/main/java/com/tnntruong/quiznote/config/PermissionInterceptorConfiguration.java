package com.tnntruong.quiznote.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class PermissionInterceptorConfiguration implements WebMvcConfigurer {

    @Bean
    PermissionInterceptor getPermissionInterceptor() {
        return new PermissionInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        String[] whiteList = {
                "/", "/api/v1/auth/**", "/storage/**", "/api/v1/files/**",
                "/api/v1/subjects/**", "/api/v1/questions/**", "/api/v1/payments/vnpay/**",
                "/api/v1/comments/**",
                "/api/v1/seller/analytics/{sellerId}",
                "/api/v1/seller/getWallet/{sellerId}",
                "/api/v1/auth/refresh"
        };
        registry.addInterceptor(getPermissionInterceptor())
                .excludePathPatterns(whiteList);
    }
}