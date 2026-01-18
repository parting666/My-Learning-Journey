# 📰 新闻管理系统 (News Management System) - v1

这是一个基于 **React (Vite)** 和 **Node.js (Express)** 构建的全栈新闻管理系统。它提供了完善的新闻 CRUD（增删改查）功能、分类筛选、关键词搜索以及用户身份验证系统。

## 🚀 主要功能

*   **新闻管理**: 支持发布、编辑、删除和查看新闻详情。
*   **筛选与搜索**: 支持按分类（如科技、体育等）筛选和按标题关键词搜索。
*   **用户系统**: 完整的注册与登录功能，使用 JWT 进行身份验证。
*   **响应式设计**: 使用 Tailwind CSS 构建，适配不同屏幕尺寸。
*   **持久化**: 登录状态持久化存储在浏览器中，刷新不丢失。

---

## 🏗️ 运行逻辑

1.  **架构**: 前后端分离架构。
    *   **前端 (news-client)**: 处理 UI 渲染、路由跳转、状态管理及 API 调用。
    *   **后端 (news-server)**: 提供 RESTful API，处理业务逻辑、数据库交互及 JWT 签发。
2.  **通讯**: 前端通过 Axios 向后端发送请求。后端通过中间件拦截需要权限的接口，验证 JWT Token。
3.  **数据存储**: 使用 MySQL 存储用户信息、新闻内容及分类数据。

---

## 🛠️ 如何启动

### 1. 环境准备
*   安装 [Node.js](https://nodejs.org/) (推荐 v18+)。
*   安装并启动 [MySQL](https://www.mysql.com/) 服务。

### 2. 数据库初始化
在 MySQL 中创建数据库并导入表结构：
```sql
CREATE DATABASE newsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
导入项目 `news-server/sql` 目录下的脚本：
1.  运行 `schema.sql` (创建表)。
2.  运行 `seed.sql` (插入初始数据)。

### 3. 配置后端
1.  进入 `news-server` 目录。
2.  将 `.env.example` 复制为 `.env` 并填写你的 MySQL 配置：
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=你的密码
    DB_NAME=newsdb
    JWT_SECRET=自定义密钥
    ```
3.  安装依赖并启动：
    ```bash
    npm install
    npm run dev
    ```

### 4. 配置前端
1.  进入 `news-client` 目录。
2.  安装依赖并启动：
    ```bash
    npm install
    npm run dev
    ```
3.  访问 [http://localhost:3000](http://localhost:3000)。

---

## ❌ 常见错误及解决方法

| 错误信息 | 原因 | 解决方法 |
| :--- | :--- | :--- |
| `vite: command not found` | 未安装 `node_modules` 依赖 | 在对应目录运行 `npm install`。 |
| `ConnectionRefused` (500 错误) | 后端无法连接到 MySQL | 检查 MySQL 服务是否启动，以及 `.env` 中的账号密码是否正确。 |
| `AxiosError: Network Error` | 前端无法连接到后端 | 检查后端是否在 `5001` 端口正常运行。 |
| `TOKEN_EXPIRED` / `401 Unauthorized` | JWT Token 过期或无效 | 尝试退出登录并重新登录。 |

---

## 📁 目录结构
*   `news-client/`: 前端源代码（React + Vite + Tailwind）。
*   `news-server/`: 后端源代码（Express + MySQL）。
*   `news-server/sql/`: 数据库初始化脚本。
