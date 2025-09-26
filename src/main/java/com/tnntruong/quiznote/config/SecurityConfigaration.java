package com.tnntruong.quiznote.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfigaration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Tắt CSRF cho REST API
                .csrf(csrf -> csrf.disable())

                // Cấu hình phân quyền cho URL
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/user/**").permitAll()
                        .anyRequest().permitAll()
                // .requestMatchers("/admin/**").hasRole("ADMIN")
                // .requestMatchers("/seller/**").hasRole("SELLER")
                // .anyRequest().authenticated())
                )

                // Form login mặc định (có thể thay JWT sau)
                .formLogin(f -> f.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
