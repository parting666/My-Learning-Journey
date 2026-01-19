# 新闻管理系统 (News Management System)

本项目是一个全栈新闻管理系统，采用现代 Web 技术栈开发。它包含完整的用户身份验证方案和新闻内容管理功能。

## 🚀 主要功能

- **用户系统**:
  - 用户注册与登录。
  - 基于 JWT (JSON Web Token) 的身份验证。
- **新闻管理**:
  - 浏览新闻列表。
  - 发布、编辑和删除新闻。
- **技术亮点**:
  - 前后端分离架构。
  - 使用 TypeScript 确保类型安全。
  - 响应式 UI 设计，支持多种终端。

## 🏗️ 架构说明

软件架构分为前端和后端两部分：

### 前端 (Frontend)
- **核心框架**: React + Vite
- **类型系统**: TypeScript
- **样式处理**: Tailwind CSS
- **网络请求**: Axios
- **页面构建**: `src/pages` 下包含登录、注册及新闻管理主页。

### 后端 (Backend)
- **核心框架**: Node.js + Express
- **类型系统**: TypeScript
- **数据库**: PostgreSQL
- **身份验证**: JWT
- **逻辑分层**: 采用 Controller-Routing-Model 的经典分层模式。

## 📂 项目目录结构

```text
news-typescript-system/
├── frontend/          # 前端 React 项目
│   ├── src/
│   │   ├── api/       # API 请求分层
│   │   ├── components/# 通用组件
│   │   ├── pages/     # 页面组件 (Login, Register, News)
│   │   └── hooks/     # 自定义 React Hooks
├── backend/           # 后端 Express 项目
│   ├── src/
│   │   ├── controllers/# 业务逻辑控制层
│   │   ├── routes/     # 路由路由定义
│   │   ├── models/     # 数据库查询/模型定义
│   │   └── utils/      # 工具函数 (如 JWT 生成)
└── .gitignore         # Git 忽略配置
```

## 🛠️ 如何运行

### 环境要求
- Node.js (建议 v18+)
- PostgreSQL 数据库

### 后端启动
1. 进入 `backend` 目录。
2. 安装依赖：`npm install`。
3. 配置 `.env` 文件（数据库连接、JWT 密钥等）。
4. 启动开发服务器：`npm run start`。

### 前端启动
1. 进入 `frontend` 目录。
2. 安装依赖：`npm install`。
3. 启动开发服务器：`npm run dev`。
4. 访问生成的 localhost 链接即可。
