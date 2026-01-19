import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY id')
    res.json(rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '服务器错误' })
  }
})
// 获取所有分类
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name FROM categories");
    res.json(rows);
  } catch (err) {
    console.error("获取分类失败", err);
    res.status(500).json({ error: "获取分类失败" });
  }
});


router.post('/', async (req, res) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ message: '分类名必填' })
  try {
    await pool.query('INSERT INTO categories (name) VALUES (?)', [name])
    res.json({ message: '分类添加成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '服务器错误' })
  }
})

export default router
