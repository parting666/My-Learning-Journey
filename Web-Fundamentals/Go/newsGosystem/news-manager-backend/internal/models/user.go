package models

import (
    "time"
)

// User 结构体定义用户数据模型
type User struct {
    ID        uint      `gorm:"primaryKey" json:"id"` // 用户唯一ID，主键
    Username  string    `gorm:"unique;not null" json:"username"` // 用户名，唯一且不能为空
    Password  string    `gorm:"not null" json:"-"`               // 密码，不应该暴露给前端，使用json:"-"忽略
    Role      string    `gorm:"not null;default:user" json:"role"` // 角色，例如 "admin" 或 "user"
    CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`  // 创建时间
    UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`  // 更新时间
}