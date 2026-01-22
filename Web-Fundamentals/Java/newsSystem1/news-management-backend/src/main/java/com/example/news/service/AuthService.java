package com.example.news.service;

import com.example.news.dto.LoginRequest;
import com.example.news.dto.RegisterRequest;
import com.example.news.model.User;
import com.example.news.repository.UserRepository;
import com.example.news.security.JwtService;
import com.example.news.security.Role;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * @AuthService
 *              处理用户注册、登录及 JWT 令牌生成的核心业务逻辑。
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    /**
     * 注册新用户
     * 
     * @param request 注册请求 DTO (假设包含 username, password, email)
     * @return 生成的 JWT 令牌
     */
    public String register(RegisterRequest request) {
        // 检查用户名是否已被使用
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("用户名已被占用");
        }

        // 1. 创建 User 实体
        User user = new User();
        user.setUsername(request.getUsername());

        // 2. 加密密码
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // 3. 默认授予普通用户权限 (USER)
        user.setRole(Role.USER);

        // 4. 保存到数据库
        User savedUser = userRepository.save(user);

        // 5. 生成并返回 JWT (自动登录)
        return jwtService.generateToken(savedUser);
    }

    /**
     * 用户登录
     * 
     * @param request 登录请求 DTO (假设包含 username, password)
     * @return 生成的 JWT 令牌
     */
    public String login(LoginRequest request) {
        // 1. 使用 AuthenticationManager 验证用户名和密码
        // 如果凭证无效，这里会抛出异常 (如 BadCredentialsException)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        // 2. 验证成功，从数据库加载用户
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("用户未找到"));

        // 3. 生成 JWT 令牌 (包含用户角色和权限信息)
        return jwtService.generateToken(user);
    }

    /**
     * 查找用户 (如果需要)
     */
    public Optional<User> findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}