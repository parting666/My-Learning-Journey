# news-server

## 初始化数据库
```sql
CREATE DATABASE newsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
导入表结构与初始分类：
```bash
mysql -u root -p newsdb < sql/schema.sql
mysql -u root -p newsdb < sql/seed.sql
```

## 启动
```bash
cp .env.example .env   # 修改成你的 MySQL 账号密码
npm i
npm run dev
```
默认监听 http://localhost:5001
