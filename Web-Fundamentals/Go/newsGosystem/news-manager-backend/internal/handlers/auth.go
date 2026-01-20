package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "news-manager-backend/internal/services"
)

// AuthHandler 结构体，持有 AuthService 依赖
type AuthHandler struct {
    authService services.AuthService
}

// NewAuthHandler 创建 AuthHandler 实例
func NewAuthHandler(authService services.AuthService) *AuthHandler {
    return &AuthHandler{authService: authService}
}

// RegisterInput 定义注册请求的 JSON 格式
type RegisterInput struct {
    Username string `json:"username" binding:"required"`
    Password string `json:"password" binding:"required"`
}

// Register 处理用户注册请求
func (h *AuthHandler) Register(c *gin.Context) {
    var input RegisterInput
    // 绑定JSON请求体到结构体
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
        return
    }

    // 调用服务层进行注册
    if err := h.authService.Register(input.Username, input.Password); err != nil {
        if err == services.ErrUserExists {
            c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}

// LoginInput 定义登录请求的 JSON 格式
type LoginInput struct {
    Username string `json:"username" binding:"required"`
    Password string `json:"password" binding:"required"`
}

// Login 处理用户登录请求
func (h *AuthHandler) Login(c *gin.Context) {
    var input LoginInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
        return
    }

    // 调用服务层进行登录
    token, err := h.authService.Login(input.Username, input.Password)
    if err != nil {
        if err == services.ErrInvalidCredentials {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to login"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Login successful", "token": token})
}