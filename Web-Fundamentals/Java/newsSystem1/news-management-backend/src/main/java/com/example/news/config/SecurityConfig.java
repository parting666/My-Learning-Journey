package com.example.news.config;

import com.example.news.security.JwtAuthenticationFilter;
import com.example.news.service.UserDetailsServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Autowired
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, UserDetailsServiceImpl userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 启用 CORS 配置
                .cors(Customizer.withDefaults())

                // 禁用 CSRF
                .csrf(AbstractHttpConfigurer::disable)

                // 配置请求权限
                .authorizeHttpRequests(auth -> auth
                        // 登录和注册允许匿名访问
                        .requestMatchers("/api/auth/**").permitAll()

                        // 新闻 GET 请求允许匿名访问
                        .requestMatchers(HttpMethod.GET, "/api/news/**").permitAll()

                        // 【权限变更】
                        // POST: 允许所有登录用户创建新闻 (USER & ADMIN)
                        .requestMatchers(HttpMethod.POST, "/api/news").authenticated()

                        // DELETE: 允许所有登录用户尝试删除 (USER 删除自己的, ADMIN 删除所有的 - 逻辑在业务层)
                        .requestMatchers(HttpMethod.DELETE, "/api/news/**").authenticated()

                        // PUT: 允许所有登录用户修改 (逻辑在业务层检查权限：USER 改自己的, ADMIN 改所有的)
                        .requestMatchers(HttpMethod.PUT, "/api/news/**").authenticated()

                        // 其他所有请求需要认证 (Any other authenticated user can access remaining endpoints)
                        .anyRequest().authenticated())

                // 配置无状态会话策略
                .sessionManagement(sess -> sess
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 配置认证提供者
                .authenticationProvider(authenticationProvider())

                // 将 JWT 过滤器添加到 UsernamePasswordAuthenticationFilter 之前
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * 显式 CORS 配置：允许前端 3000 端口访问
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 包含所有已知的本地开发端口（包括您的 3000 端口）
        configuration
                .setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // ====================== Beans ======================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
