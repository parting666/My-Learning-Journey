package repository

import (
    "news-manager-backend/internal/models"
    "gorm.io/gorm"
)

// NewsRepository 定义了新闻数据访问接口
type NewsRepository interface {
    CreateNews(news *models.News) error
    FindNewsByID(id uint) (*models.News, error)
    UpdateNews(news *models.News) error
    DeleteNews(id uint) error
    // FindNewsByTitleAndPaginate 实现模糊查询和分页
    FindNewsByTitleAndPaginate(title string, page, pageSize int) ([]models.News, int64, error)
}

// newsRepositoryImpl 是 NewsRepository 接口的实现
type newsRepositoryImpl struct {
    db *gorm.DB
}

// NewNewsRepository 创建一个新的新闻仓库实例
func NewNewsRepository(db *gorm.DB) NewsRepository {
    return &newsRepositoryImpl{db: db}
}

// CreateNews 在数据库中创建一条新新闻
func (r *newsRepositoryImpl) CreateNews(news *models.News) error {
    return r.db.Create(news).Error
}

// FindNewsByTitleAndPaginate 实现模糊查询和分页
func (r *newsRepositoryImpl) FindNewsByTitleAndPaginate(title string, page, pageSize int) ([]models.News, int64, error) {
    var news []models.News
    var total int64
    
    // 基础查询
    query := r.db.Model(&models.News{})
    
    // 如果标题不为空，添加模糊查询条件
    if title != "" {
        query = query.Where("title LIKE ?", "%"+title+"%")
    }
    
    // 先获取总数，用于前端分页
    if err := query.Count(&total).Error; err != nil {
        return nil, 0, err
    }
    
    // 分页查询
    offset := (page - 1) * pageSize
    if err := query.Offset(offset).Limit(pageSize).Find(&news).Error; err != nil {
        return nil, 0, err
    }
    
    return news, total, nil
}
// DeleteNews 删除数据库中的新闻记录
func (r *newsRepositoryImpl) DeleteNews(id uint) error {
	// 使用 GORM 的 Delete 方法，根据 ID 删除 News 记录
	return r.db.Delete(&models.News{}, id).Error
}

// FindNewsByID 通过ID查找新闻
func (r *newsRepositoryImpl) FindNewsByID(id uint) (*models.News, error) {
    var news models.News
    // 使用 GORM 的 First 方法根据主键（ID）查找第一条记录
    if err := r.db.First(&news, id).Error; err != nil {
        // 如果找不到记录，或者有其他数据库错误，返回 nil 和错误信息
        return nil, err
    }
    // 成功找到，返回新闻对象和 nil 错误
    return &news, nil
}

// UpdateNews 更新数据库中的新闻记录
func (r *newsRepositoryImpl) UpdateNews(news *models.News) error {
	// 使用 GORM 的 Save 方法更新记录。如果记录的主键不为0，GORM 会执行更新操作。
	return r.db.Save(news).Error
}