package com.example.news.config;

import com.example.news.model.User;
import com.example.news.repository.UserRepository;
import com.example.news.security.Role;
import org.springframework.boot.CommandLineRunner;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * DataLoader
 * 启动时运行，用于创建初始的 ADMIN 用户。
 */
@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        initData();
    }

    private void initData() {
        // 仅在数据库中没有用户时才创建管理员账户
        if (userRepository.findByUsername("admin").isEmpty()) {
            User adminUser = new User();
            adminUser.setUsername("admin");

            adminUser.setPassword(passwordEncoder.encode("password"));
            adminUser.setRole(Role.ADMIN);
            userRepository.save(adminUser);

            System.out.println("--- ADMIN user created: admin/password ---");
        }
    }
}