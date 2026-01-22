package com.example.news.service;

import com.example.news.repository.UserRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Custom UserDetailsService 实现
 * 负责从数据库加载用户数据，供 Spring Security 认证使用。
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 根据用户名加载用户。
     * 
     * @param username 用户的唯一标识符
     * @return 实现了 UserDetails 接口的用户对象
     * @throws UsernameNotFoundException 如果用户未找到
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 由于 User.java 已经实现了 UserDetails 接口，这里可以直接返回 User 实体
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("用户未找到: " + username));
    }
}