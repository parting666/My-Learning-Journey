package services

import (
    "news-manager-backend/internal/models"
    "news-manager-backend/internal/repository"
    "news-manager-backend/internal/utils"
)

// AuthService 定义了认证业务逻辑接口
type AuthService interface {
    Register(username, password string) error
    Login(username, password string) (string, error)
}

// authServiceImpl 是 AuthService 接口的实现
type authServiceImpl struct {
    userRepo repository.UserRepository
}

// NewAuthService 创建一个新的认证服务实例
func NewAuthService(userRepo repository.UserRepository) AuthService {
    return &authServiceImpl{userRepo: userRepo}
}

// Register 处理用户注册业务逻辑
func (s *authServiceImpl) Register(username, password string) error {
    // 检查用户名是否已存在
    _, err := s.userRepo.FindUserByUsername(username)
    if err == nil {
        return ErrUserExists
    }

    // 哈希密码
    hashedPassword, err := utils.HashPassword(password)
    if err != nil {
        return err
    }

    // 创建新用户模型
    user := &models.User{
        Username: username,
        Password: hashedPassword,
        Role:     "user", // 默认角色为普通用户
    }

    // 调用仓库层创建用户
    return s.userRepo.CreateUser(user)
}

// Login 处理用户登录业务逻辑
func (s *authServiceImpl) Login(username, password string) (string, error) {
    // 查找用户
    user, err := s.userRepo.FindUserByUsername(username)
    if err != nil {
        return "", ErrInvalidCredentials
    }

    // 验证密码
    if !utils.CheckPasswordHash(password, user.Password) {
        return "", ErrInvalidCredentials
    }

    // 生成JWT token
    token, err := utils.GenerateJWT(user.ID, user.Username, user.Role)
    if err != nil {
        return "", ErrTokenGenerationFailed
    }

    return token, nil
}