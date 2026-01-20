package models

import (
    "time"
)

// News 结构体定义新闻数据模型
type News struct {
    ID          uint      `gorm:"primaryKey" json:"id"` // 新闻唯一ID，使用gorm标签指定为主键
    Title       string    `gorm:"not null" json:"title"`       // 新闻标题，不能为空
    Content     string    `gorm:"type:text" json:"content"`     // 新闻内容，使用text类型以存储长文本
    AuthorID    uint      `gorm:"not null" json:"author_id"`   // 作者ID，关联User表
    CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"` // 创建时间，由GORM自动填充
    UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"` // 更新时间，由GORM自动填充
}