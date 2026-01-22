package com.example.news.model;

import com.example.news.security.Role;
import jakarta.persistence.*;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * @User
 *       用户实体类，现已实现 UserDetails 接口，用于 Spring Security 认证。
 */
@Entity
@Table(name = "users") // 约定俗成，表名使用复数
public class User implements UserDetails { // <-- 关键修复：实现 UserDetails 接口

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 用户名，必须唯一且非空
    @Column(unique = true, nullable = false)
    private String username;

    // 密码字段
    @Column(nullable = false)
    private String password;

    // 用户角色字段
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    public User() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    // --- 实现 UserDetails 接口方法 ---

    /**
     * 返回授予用户的权限（角色）列表。
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 权限通常基于用户的角色（Role）
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    /**
     * 账户是否过期（我们默认永不过期）
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * 账户是否被锁定（我们默认不锁定）
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * 凭证（密码）是否过期（我们默认永不过期）
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * 账户是否可用（我们默认可用）
     */
    @Override
    public boolean isEnabled() {
        return true;
    }

    // getPassword() 和 getUsername() 由 Lombok 的 @Data 自动生成
}