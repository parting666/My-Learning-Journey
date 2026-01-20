package middleware

import (
	"log"
	"net/http"
	"news-manager-backend/internal/utils"
	"strings"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware 是一个JWT认证中间件
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		authHeader := c.GetHeader("Authorization")

		log.Printf("获得的用户authHeader: %v", authHeader)
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		// 检查请求头是否以 "Bearer " 开头
		parts := strings.Split(authHeader, " ")
		log.Printf("获得的用户parts: %v", parts)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization header format"})
			c.Abort()
			return
		}

		log.Printf("获得的用户parts: %v", parts)

		tokenString := parts[1]
		claims, err := utils.ValidateJWT(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token", "detail": err.Error()})
			c.Abort()
			return
		}

		// 将用户信息存储到context中，供后续的handler使用

		//  log.Printf("获得的用户id: %v", claims.userID)
		//log.Printf("获得的用户角色: %v", claims.Role)
		c.Set("userID", claims.UserID)
		c.Set("userRole", claims.Role)

		c.Next()
	}
}
