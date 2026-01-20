package services

import (
    "news-manager-backend/internal/models"
    "news-manager-backend/internal/repository"
)
// NewsService 定义了新闻业务逻辑接口
type NewsService interface {
    CreateNews(news *models.News) error 
    GetNewsByID(id uint) (*models.News, error) 
    UpdateNews(news *models.News) error 
    DeleteNews(id uint) error 
    GetNewsList(title string, page, pageSize int) ([]models.News, int64, error)
}

// newsServiceImpl 是 NewsService 接口的实现
type newsServiceImpl struct {
    repo repository.NewsRepository
}

// CreateNews 创建新新闻
func (s *newsServiceImpl) CreateNews(news *models.News) error {
    // 调用 repository 层进行数据库操作
    return s.repo.CreateNews(news)
}

// NewNewsService 创建一个新的新闻服务实例
func NewNewsService(repo repository.NewsRepository) NewsService {
    return &newsServiceImpl{repo: repo}
}

// GetNewsList 获取新闻列表，支持模糊查询和分页
func (s *newsServiceImpl) GetNewsList(title string, page, pageSize int) ([]models.News, int64, error) {
    // 调用 repository 层进行数据库查询
    return s.repo.FindNewsByTitleAndPaginate(title, page, pageSize)
}
 // DeleteNews 删除新闻
func (s *newsServiceImpl) DeleteNews(id uint) error {
	return s.repo.DeleteNews(id)
}
// GetNewsByID 通过ID获取新闻
func (s *newsServiceImpl) GetNewsByID(id uint) (*models.News, error) {
	return s.repo.FindNewsByID(id)
}
// UpdateNews 更新新闻
func (s *newsServiceImpl) UpdateNews(news *models.News) error {
	return s.repo.UpdateNews(news)
}