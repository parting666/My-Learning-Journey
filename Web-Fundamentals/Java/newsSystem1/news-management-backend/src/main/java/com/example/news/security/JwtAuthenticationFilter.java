// com/example/news/security/JwtAuthenticationFilter.java

package com.example.news.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import com.example.news.service.UserDetailsServiceImpl;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    // 定义不需要JWT认证的公共路径匹配器列表
    private final AntPathRequestMatcher authMatcher = new AntPathRequestMatcher("/api/auth/**");
    private final AntPathRequestMatcher newsGetMatcher = new AntPathRequestMatcher("/api/news/**",
            HttpMethod.GET.toString());

    @Autowired
    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsServiceImpl userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    /**
     * 覆盖 shouldNotFilter 方法：
     * 如果请求匹配公共路径，则返回 true (不执行过滤)，确保 permitAll() 能生效。
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // 如果请求匹配 authMatcher 或 newsGetMatcher，则返回 true (不执行过滤)
        return authMatcher.matches(request) || newsGetMatcher.matches(request);
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 1. 检查是否有 JWT Token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            // 2. 从 Token 中提取用户名
            username = jwtService.extractUsername(jwt);

            // 3. 检查用户名是否存在且当前 SecurityContext 中没有认证信息
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // 加载用户详情
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                // 4. 验证 Token 是否有效
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    // 创建认证 Token
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));

                    // 5. 将认证 Token 设置到 Security Context
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // JWT 解析或验证失败
            System.err.println("JWT authentication failed, clearing context: " + e.getMessage());
            SecurityContextHolder.clearContext();
            // 允许请求继续
        }

        filterChain.doFilter(request, response);
    }
}