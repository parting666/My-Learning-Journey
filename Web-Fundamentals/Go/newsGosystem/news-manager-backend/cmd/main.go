package main

import (
	"fmt"
	"log"
	"time"

	"news-manager-backend/config"
	"news-manager-backend/internal/handlers"
	"news-manager-backend/internal/middleware"
	"news-manager-backend/internal/models"
	"news-manager-backend/internal/repository"
	"news-manager-backend/internal/services"

	"github.com/gin-contrib/cors" // 导入 Gin 的 CORS 中间件
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1. 加载配置
	cfg := config.LoadConfig()

	// 2. 连接数据库
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai",
		cfg.DB_HOST, cfg.DB_USER, cfg.DB_PASSWORD, cfg.DB_NAME, cfg.DB_PORT)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// 自动迁移数据库模型
	err = db.AutoMigrate(&models.User{}, &models.News{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// 3. 依赖注入 (DI) 和服务初始化
	userRepo := repository.NewUserRepository(db)
	newsRepo := repository.NewNewsRepository(db)
	authService := services.NewAuthService(userRepo)
	newsService := services.NewNewsService(newsRepo)
	authHandler := handlers.NewAuthHandler(authService)
	newsHandler := handlers.NewNewsHandler(newsService)

	// 4. 初始化 Gin 路由器
	router := gin.Default()

	// 2. 在这里配置和使用 CORS 中间件
	router.Use(cors.New(cors.Config{
		// 允许访问的源，这里设置为你前端的地址
		AllowOrigins: []string{"http://localhost:3002", "http://127.0.0.1:3002"},
		// 允许的请求方法
		AllowMethods: []string{"PUT", "PATCH", "POST", "GET", "DELETE", "OPTIONS"},
		// 允许的请求头
		AllowHeaders: []string{"Origin", "Authorization", "Content-Type", "Accept", "X-Requested-With"},
		// 允许暴露的响应头
		ExposeHeaders: []string{"Content-Length"},
		// 是否允许携带 cookie
		AllowCredentials: true,
		// 预检请求的缓存时间
		MaxAge: 12 * time.Hour,
	}))

	// 设置一个统一的 /api/v1 路由组
	apiV1 := router.Group("/api/v1")
	{
		// 用户认证相关路由
		apiV1.POST("/register", authHandler.Register)
		apiV1.POST("/login", authHandler.Login)

		// 新闻相关路由
		newsRoutes := apiV1.Group("/news")
		{
			// 无需认证即可访问的路由
			// GET "" 会匹配 /api/v1/news
			newsRoutes.GET("", newsHandler.GetNewsList)
			newsRoutes.GET("/:id", newsHandler.GetNewsByID)

			// 需要认证才能访问的路由
			// 在这里应用认证中间件
			authorized := newsRoutes.Group("")
			authorized.Use(middleware.AuthMiddleware())
			{
				// POST "" 会匹配 /api/v1/news
				authorized.POST("", newsHandler.CreateNews)
				authorized.PUT("/:id", newsHandler.UpdateNews)
				authorized.DELETE("/:id", newsHandler.DeleteNews)
			}
		}
	}

	// 7. 启动服务器
	log.Printf("Server is running on port %s", cfg.SERVER_PORT)
	if err := router.Run(":" + cfg.SERVER_PORT); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
