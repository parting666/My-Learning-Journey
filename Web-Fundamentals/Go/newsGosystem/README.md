# 新闻管理系统 (News Management System)

本项目是一个基于 Go (Gin) 和 React (Vite + TS) 的全栈新闻管理系统。支持新闻的发布、编辑、删除以及用户权限管理。

## 🚀 项目功能

- **用户系统**：注册、登录（基于 JWT 身份验证）。
- **新闻管理**：
  - 新闻列表展示（支持分页和标题搜索）。
  - 新闻详情查看。
  - 发布新闻（仅限登录用户）。
  - 编辑/删除新闻（仅限作者或管理员）。
- **安全性**：
  - 后端 CORS 跨域配置。
  - 身份验证中间件，保护敏感接口。
  - 密码哈希存储（建议实现）。

## 🏗 项目架构

系统采用前后端分离的架构：

### 后端 (Go/Gin) - `news-manager-backend`
采用分层架构提高可维护性：
- **`cmd/`**: 程序入口，负责初始化和启动。
- **`internal/handlers/`**: 处理 HTTP 请求，参数绑定。
- **`internal/services/`**: 业务核心逻辑。
- **`internal/repository/`**: 数据库持久化操作 (GORM)。
- **`internal/middleware/`**: 鉴权 (JWT) 和跨域 (CORS) 中间件。
- **`internal/models/`**: 数据库模型映射。

### 前端 (React/TS) - `news-manager-frontend`
- **Vite**: 构建工具。
- **Axios**: API 请求客户端，带拦截器自动注入 Token。
- **Tailwind CSS**: 响应式 UI 框架。

---

## 🛠 运行逻辑

1. **请求流程**：前端发起 API 请求 -> 后端 CORS 中间件验证 -> JWT 中间件校验身份 -> Handler 执行业务 -> DB 返回数据。
2. **状态管理**：前端使用 Zustand (或类似库) 管理用户登录状态和 Token。

---

## 🏁 启动步骤

### 1. 准备环境
- 安装 Go (1.20+)。
- 安装 Node.js (18+)。
- 安装 PostgreSQL 并创建一个名为 `news_go` 的数据库。

### 2. 配置环境变量
分别进入 `news-manager-backend` 和 `news-manager-frontend` 目录：
- 复制 `.env.example` 为 `.env`。
- 根据你的实际情况（数据库密码、秘钥等）修改 `.env` 文件。

### 3. 启动后端
```bash
cd news-manager-backend
go mod tidy
go run cmd/main.go
```

### 4. 启动前端
```bash
cd news-manager-frontend
npm install
npm run dev
```

---

## ❓ 常见问题及解决方法

### 1. CORS 跨域错误
**现象**：浏览器控制台提示 `Access-Control-Allow-Origin` 缺失。
**原因**：前端请求的地址（如 `127.0.0.1` vs `localhost`）未在后端允许列表中，或请求头不匹配。
**解决**：检查 `main.go` 中的 `AllowOrigins` 配置，确保包含了前端的运行地址。

### 2. JWT Token 无效或过期
**现象**：请求返回 `401 Unauthorized`。
**原因**：Token 未在 Header 中发送，或后端 `JWT_SECRET` 与签署时不一致。
**解决**：检查前端 `api.ts` 的拦截器是否正确设置了 `Authorization` 头。

### 3. 数据库连接失败
**现象**：后台日志提示 `Failed to connect to database`。
**原因**：`.env` 中的数据库配置有误，或 Postgres 服务未启动。
**解决**：验证 `DB_HOST`、`DB_USER`、`DB_PASSWORD` 等信息是否正确。

### 4. TypeScript 找不到 `import.meta.env`
**现象**：编译时报错 `Property 'env' does not exist on type 'ImportMeta'`。
**解决**：在 `tsconfig.json` 的 `compilerOptions.types` 中添加 `"vite/client"`。
