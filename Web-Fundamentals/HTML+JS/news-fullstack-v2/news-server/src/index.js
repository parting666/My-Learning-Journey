import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import newsRoutes from './routes/news.js'
import authRoutes from './routes/auth.js'
import categoriesRoutes from "./routes/categories.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(bodyParser.json())

// 🔹 测试接口，确认后端运行正常
app.get('/api/test', (req, res) => {
  res.json({ message: '后端运行正常 ✅' })
})

// 🔹 用户认证相关路由
app.use('/api', authRoutes)

// 🔹 新闻相关路由
app.use('/api/news', newsRoutes)

app.use("/api/categories", categoriesRoutes);

// 🔹 兜底路由（防止 404 报错）
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在 ❌' })
})

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})