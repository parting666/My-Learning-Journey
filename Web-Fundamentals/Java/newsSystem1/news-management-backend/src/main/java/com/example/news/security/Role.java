package com.example.news.security;

public enum Role {
    // 具有最高权限，可以执行所有受保护的操作（例如创建新闻）
    ADMIN,
    // 普通用户，可能只具有查看权限
    USER
}
