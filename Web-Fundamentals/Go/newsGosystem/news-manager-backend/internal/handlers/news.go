package handlers

import (
    "net/http"
    "strconv"
    "log"
    "github.com/gin-gonic/gin"
    "news-manager-backend/internal/models"
    "news-manager-backend/internal/services"
     
)

// NewsHandler 结构体，持有 NewsService 依赖
type NewsHandler struct {
    service services.NewsService
}

// NewNewsHandler 创建 NewsHandler 实例
func NewNewsHandler(service services.NewsService) *NewsHandler {
    return &NewsHandler{service: service}
}

// GetNewsList 获取新闻列表，支持模糊查询和分页
func (h *NewsHandler) GetNewsList(c *gin.Context) {
    title := c.Query("title")
    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
    
    news, total, err := h.service.GetNewsList(title, page, pageSize)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get news list"})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{
        "data":     news,
        "total":    total,
        "page":     page,
        "pageSize": pageSize,
    })
}

// CreateNewsInput 定义创建新闻的请求体
type CreateNewsInput struct {
    Title   string `json:"title" binding:"required"`
    Content string `json:"content" binding:"required"`
}

// CreateNews 创建新闻
func (h *NewsHandler) CreateNews(c *gin.Context) {

    var input CreateNewsInput

  log.Printf("获得的新闻：%+v", input)
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
        return
    }
    
    // 从JWT中获取用户ID，并添加到新闻模型中
    userID, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    news := &models.News{
        Title:   input.Title,
        Content: input.Content,
        AuthorID: userID.(uint), 
    }

    if err := h.service.CreateNews(news); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create news"})
        return
    }
    
    c.JSON(http.StatusCreated, gin.H{"message": "News created successfully"})
}

// UpdateNewsInput 定义更新新闻的请求体
type UpdateNewsInput struct {
    Title   string `json:"title"`
    Content string `json:"content"`
}

// UpdateNews 更新新闻
func (h *NewsHandler) UpdateNews(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.ParseUint(idStr, 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid news ID"})
        return
    }

    var input UpdateNewsInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
        return
    }

    news, err := h.service.GetNewsByID(uint(id))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "News not found"})
        return
    }

    // 检查是否为新闻作者或管理员
    userID, _ := c.Get("userID")
    role, _ := c.Get("userRole")
    if news.AuthorID != uint(userID.(uint)) && role != "admin" {
        c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to update this news"})
        return
    }
    
    if input.Title != "" {
        news.Title = input.Title
    }
    if input.Content != "" {
        news.Content = input.Content
    }

    if err := h.service.UpdateNews(news); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update news"})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"message": "News updated successfully"})
}

// DeleteNews 删除新闻
func (h *NewsHandler) DeleteNews(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.ParseUint(idStr, 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid news ID"})
        return
    }

    news, err := h.service.GetNewsByID(uint(id))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "News not found"})
        return
    }

    // 检查是否为新闻作者或管理员
    userID, _ := c.Get("userID")
    role, _ := c.Get("userRole")
    if news.AuthorID != uint(userID.(uint)) && role != "admin" {
        c.JSON(http.StatusForbidden, gin.H{"error": "You are not authorized to delete this news"})
        return
    }

    if err := h.service.DeleteNews(uint(id)); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete news"})
        return
    }
    
    c.JSON(http.StatusOK, gin.H{"message": "News deleted successfully"})
}

func (h *NewsHandler) GetNewsByID(c *gin.Context) {
    // 从 URL 参数中获取 ID
    idStr := c.Param("id")
    id, err := strconv.ParseUint(idStr, 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid news ID"})
        return
    }

    // 调用服务层方法获取新闻
    news, err := h.service.GetNewsByID(uint(id))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "News not found"})
        return
    }

    // 成功获取新闻后返回 JSON 响应
    c.JSON(http.StatusOK, news)
}