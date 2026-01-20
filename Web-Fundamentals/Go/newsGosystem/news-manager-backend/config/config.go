package config

import (
    "log"
    "github.com/joho/godotenv" // 导入用于加载 .env 文件的库
    "os"
)

// Config 结构体用于存储环境变量
type Config struct {
    DB_HOST     string
    DB_USER     string
    DB_PASSWORD string
    DB_NAME     string
    DB_PORT     string
    JWT_SECRET  string
    SERVER_PORT string
}

// LoadConfig 从 .env 文件中加载配置
func LoadConfig() *Config {
    // 使用 godotenv 库加载 .env 文件
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file")
    }

    return &Config{
        DB_HOST:     os.Getenv("DB_HOST"),
        DB_USER:     os.Getenv("DB_USER"),
        DB_PASSWORD: os.Getenv("DB_PASSWORD"),
        DB_NAME:     os.Getenv("DB_NAME"),
        DB_PORT:     os.Getenv("DB_PORT"),
        JWT_SECRET:  os.Getenv("JWT_SECRET"),
        SERVER_PORT: os.Getenv("SERVER_PORT"),
    }
}