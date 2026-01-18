# 新闻管理系统 (News Management System)

这是一个基于 Node.js 后端和 Vue.js 前端的新闻管理系统，支持新闻发布、编辑、删除、分页查询以及图片上传（对接七牛云）等功能。

## 项目主要功能

- **用户管理**: 支持用户注册、登录，并采用 JWT 进行身份验证。
- **新闻列表**: 实现新闻的分页展示、关键词模糊搜索。
- **新闻发布/编辑**: 支持文字内容及单图/多图上传。
- **图片管理**: 对接七牛云对象存储，实现高效的图片上传与云端访问。
- **API 文档**: 集成了 Swagger，方便开发者查看和测试全量 API 接口。

## 技术栈

- **前端**: Vue 3 + Vite + Element Plus + Axios
- **后端**: Node.js + Express + MySQL + SevenQiniu SDK
- **文档**: Swagger (swagger-jsdoc & swagger-ui-express)

---

## 快速启动

### 1. 准备工作
- 确保已安装 Node.js (建议 v16+) 和 MySQL 数据库。
- 准备一个七牛云存储空间 (Bucket) 以及对应的 AccessKey 和 SecretKey。

### 2. 配置环境变量
项目使用 `.env` 文件管理配置。**请务必不要将包含真实密码的 `.env` 上传至 GitHub。**

- **后端配置**: 进入 `news-management-backend` 目录，将 `.env` 按照模板填写：
  - `DB_PASSWORD`: 数据库密码
  - `QINIU_ACCESS_KEY`/`QINIU_SECRET_KEY`: 七牛云密钥
- **前端配置**: 进入 `news-management-frontend` 目录，修改 `.env` 中的 `VITE_API_BASE_URL` 指向你的后端接口地址。

### 3. 运行后端
```bash
cd news-management-backend
npm install
npm run start
```

### 4. 运行前端
```bash
cd news-management-frontend
npm install
npm run dev
```
访问浏览器显示的本地地址（通常是 `http://localhost:5173`）即可。

---

## 运行逻辑

1. **认证**: 用户登录后，后端签发 JWT Token，前端将其存储在 `localStorage` 中。随后的所有敏感请求都会在请求头中携带该 Token。
2. **列表加载**: 前端调用 `/api/news` 接口，后端根据分页参数和搜索关键字，从 MySQL 数据库中联合用户表查询数据并返回。
3. **上传**: 前端点击上传后，先向后端请求七牛云的 `uploadToken`，随后前端直接将文件流推送到七牛云服务器。成功后，将返回的图片 Key 拼接域名并保存至数据库。

---

## 常见错误及解决

### 1. 图片显示裂图 / 显示不出来
- **原因**: 检查 `QINIU_DOMAIN` 是否配置正确。注意：七牛云测试域名有效期仅 30 天，过期后需绑定自定义域名。
- **解决**: 修改 `.env` 中的域名配置，确保该链接在浏览器中能直接访问。

### 2. EADDRINUSE: address already in use :::3000
- **原因**: 3000 端口已被占用（通常是上一个服务没关掉）。
- **解决**: 使用 `lsof -i :3000` 找到对应的 PID 并用 `kill -9 <PID>` 杀死进程，然后重新启动。

### 3. Swagger 报错 "Map keys must be unique"
- **原因**: JSDoc 注释中的缩进不符合 YAML 标准或存在重复的路径定义。
- **解决**: 检查路由文件中的 `@swagger` 块，确保严格遵循两个空格的缩进规则。

### 4. 数据库连接失败
- **原因**: MySQL 服务未启动，或 `.env` 中的用户名/密码/数据库名不正确。
- **解决**: 确认数据库已创建并同步。

---

## 开发者
*   [Your Name / GitHub ID]
