package repository

import (
    "news-manager-backend/internal/models"
    "gorm.io/gorm"
)

// UserRepository 定义用户数据访问接口
type UserRepository interface {
    CreateUser(user *models.User) error
    FindUserByUsername(username string) (*models.User, error)
}

// userRepositoryImpl 是 UserRepository 接口的实现
type userRepositoryImpl struct {
    db *gorm.DB
}

// NewUserRepository 创建一个新的用户仓库实例
func NewUserRepository(db *gorm.DB) UserRepository {
    return &userRepositoryImpl{db: db}
}

// CreateUser 在数据库中创建一条新用户记录
func (r *userRepositoryImpl) CreateUser(user *models.User) error {
    return r.db.Create(user).Error
}

// FindUserByUsername 通过用户名查找用户
func (r *userRepositoryImpl) FindUserByUsername(username string) (*models.User, error) {
    var user models.User
    // 使用 First 方法查询用户名，并处理未找到记录的错误
    if err := r.db.Where("username = ?", username).First(&user).Error; err != nil {
        return nil, err
    }
    return &user, nil
}