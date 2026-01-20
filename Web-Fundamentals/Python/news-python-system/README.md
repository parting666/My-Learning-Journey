# 新闻管理系统 (News Management System)

这是一个基于 **FastAPI** 后端和 **React (TypeScript)** 前端的全栈新闻管理系统。支持用户注册、登录、新闻发布、编辑和删除功能。

## 🚀 项目架构

项目采用前后端分离架构：

- **后端 (backend)**:
  - 框架: FastAPI (Python 3.13+)
  - 数据库: PostgreSQL (使用 SQLAlchemy ORM)
  - 认证: JWT (JSON Web Tokens)
  - 核心逻辑位于 `app/` 目录下，采用 `api/endpoints` 分层设计。

- **前端 (frontend)**:
  - 框架: React 18 + TypeScript + Vite
  - 样式: Tailwind CSS
  - 状态管理: Zustand
  - API 交互: Axios

## 🛠️ 主要功能

1.  **用户系统**: 注册、登录、加密存储密码、JWT 令牌验证。
2.  **新闻管理**:
    - 发布新闻 (标题、作者、内容)。
    - 新闻列表展示（支持分页和关键词模糊查询）。
    - 编辑和删除新闻。
3.  **安全性**: 跨域资源共享 (CORS) 配置，路由权限保护（未登录跳转登录）。

## ⚙️ 启动方法

### 1. 后端启动 (Backend)

1.  进入后端目录：
    ```bash
    cd backend
    ```
2.  创建并激活虚拟环境（推荐）：
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # macOS/Linux
    ```
3.  安装依赖：
    ```bash
    pip install -r requirements.txt
    ```
4.  配置环境变量：
    修改 `.env` 文件，填入你的 PostgreSQL 数据库信息（用户名、密码、数据库名）。
5.  运行项目：
    ```bash
    uvicorn app.main:app --reload --port 8001
    ```

### 2. 前端启动 (Frontend)

1.  进入前端目录：
    ```bash
    cd frontend
    ```
2.  安装依赖：
    ```bash
    npm install
    ```
3.  运行项目：
    ```bash
    npm run dev
    ```
    访问启动成功的地址（默认通常是 `http://localhost:5173`）。

## ⚠️ 常见报错与解决方法

| 报错信息 | 原因 | 解决方法 |
| :--- | :--- | :--- |
| `ModuleNotFoundError: No module named 'email_validator'` | 缺少 Pydantic 校验扩展 | `pip install email_validator` |
| `RuntimeError: Form data requires "python-multipart"` | FastAPI 接收表单需要此库 | `pip install python-multipart` |
| `ValueError: password cannot be longer than 72 bytes` | `passlib` 与新版 `bcrypt` 不兼容 | `pip install "bcrypt<4.0.0"` 降级 bcrypt |
| `TypeError: Cannot redefine property: ethereum` | 浏览器插件冲突 | 忽略或尝试在无痕模式运行 |
| CORS Policy Error (500) | 后端逻辑报错，导致未返回跨域头 | 检查后端 `uvicorn` 控制台的具体报错，修复后再试 |
| `Empty Admin Page` (登录后白屏/无内容) | 路由或登录状态未同步 | 确保登录后跳转至 `/admin` 并通过 `setToken` 更新状态 |

## 📝 备注
- 后端默认运行端口：`8001`
- 数据库连接默认使用 `postgresql+psycopg2` 驱动。