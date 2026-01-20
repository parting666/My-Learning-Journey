package utils

import (
    "time"
    "os"
    "github.com/dgrijalva/jwt-go"
)

// CustomClaims 定义JWT的自定义载荷
type CustomClaims struct {
    UserID   uint   `json:"user_id"`
    Username string `json:"username"`
    Role     string `json:"role"`
    jwt.StandardClaims
}

// GenerateJWT 生成JWT token
func GenerateJWT(userID uint, username, role string) (string, error) {
    claims := &CustomClaims{
        UserID:   userID,
        Username: username,
        Role:     role,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), // token 24小时后过期
            Issuer:    "news-manager-api",
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    // 从环境变量中获取JWT密钥
    secretKey := os.Getenv("JWT_SECRET")
    if secretKey == "" {
        return "", ErrJWTSecretNotSet
    }
    return token.SignedString([]byte(secretKey))
}

// ValidateJWT 验证并解析JWT token
func ValidateJWT(tokenString string) (*CustomClaims, error) {
    secretKey := os.Getenv("JWT_SECRET")
    if secretKey == "" {
        return nil, ErrJWTSecretNotSet
    }

    token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, ErrInvalidToken
        }
        return []byte(secretKey), nil
    })
    if err != nil {
        return nil, err
    }

    claims, ok := token.Claims.(*CustomClaims)
    if !ok || !token.Valid {
        return nil, ErrInvalidToken
    }
    return claims, nil
}