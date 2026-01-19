# NewsPulse - 新闻管理系统 (Fullstack V2)

NewsPulse 是 built 一个现代化的全栈新闻管理系统。本项目采用前后端分离架构，前端使用 React + Material UI 构建，后端使用 Node.js + Express + MySQL 实现。

## 🌟 主要功能

- **用户认证**：支持用户注册与登录，采用 JWT (JSON Web Token) 进行身份验证。
- **持久化会话**：登录状态在页面刷新后依然保持，无需重新登录。
- **新闻管理 (CRUD)**：
  - 发布新新闻
  - 查看新闻列表
  - 编辑已发布的新闻
  - 删除新闻
- **分类系统**：新闻支持按类别归类。
- **现代 UI 设计**：采用 Glassmorphism (毛玻璃) 风格，配合平滑动画与响应式布局。

## 🏗 运行逻辑

1. **前端 (news-client)**：React 应用程序通过 Axios 向后端发送 API 请求。所有认证请求（登录/注册）成功后，Token 会保存在 `localStorage` 中。全局 `AuthContext` 负责管理用户状态。
2. **后端 (news-server)**：Express 服务器协调业务逻辑。
   - `authMiddleware` 校验请求头中的 JWT Token。
   - 数据库交互通过 `db.js` (mysql2) 完成。
3. **数据库 (MySQL)**：存储用户信息、新闻内容及分类。

## 🚀 启动步骤

### 1. 数据库配置
首先，确保你的 MySQL 服务已启动，并创建一个名为 `newsdb` 的数据库。你可以运行 `news-server/sql` 目录下的初始化脚本。

### 2. 后端启动 (Server)
```bash
cd news-server
npm install
# 复制并配置环境变量
cp .env.example .env 
# 请在 .env 中填写你的数据库连接信息
npm run dev
```

### 3. 前端启动 (Client)
```bash
cd news-client
npm install
npm run dev
```
访问：`http://localhost:5173`

## ⚠️ 常见错误及解决方法

| 错误现象 | 可能原因 | 解决方法 |
| :--- | :--- | :--- |
| **无法获取新闻列表** | 后端未启动或数据库连接失败 | 检查 `news-server` 终端是否有报错，确认 `.env` 中的数据库配置正确。 |
| **登录后刷新页面变回未登录** | `AuthContext` 未正确包裹 `App` | 确认 `main.jsx` 中已包含 `<AuthProvider>`。 (注：此问题已在 V2 版本中修复) |
| **添加新闻提示 "操作失败"** | 分类 ID 为空或 Token 过期 | 确保选择了分类；如果 Token 过期，请退出并重新登录。 |
| **前端请求 501/500 错误** | 后端逻辑报错 | 检查后端控制台输出的具体错误日志，通常是 SQL 语句报错或字段缺失。 |
| **CORS 错误** | 后端未正确配置跨域 | 确认 `news-server/src/index.js` 中已使用 `app.use(cors())`。 |

## 🛠 开发技术栈

- **Frontend**: React, Material UI (MUI), Axios, Vite
- **Backend**: Node.js, Express, MySQL, JWT, bcryptjs
- **Styling**: Vanilla CSS (Custom tokens), MUI System
