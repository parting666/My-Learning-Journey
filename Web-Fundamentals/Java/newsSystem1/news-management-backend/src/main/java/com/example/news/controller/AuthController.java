package com.example.news.controller;

import com.example.news.dto.LoginRequest;
import com.example.news.dto.RegisterRequest;
import com.example.news.model.User;
import com.example.news.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> authenticateUser(@RequestBody LoginRequest request) {
        try {
            String jwt = authService.login(request);
            // 在实际项目中，通常返回一个包含 JWT 的 DTO
            return ResponseEntity.ok(jwt);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Authentication failed: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
}