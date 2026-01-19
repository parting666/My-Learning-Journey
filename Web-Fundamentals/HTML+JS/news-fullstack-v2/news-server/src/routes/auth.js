import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'
import dotenv from 'dotenv'
dotenv.config()

const router = Router()

router.post('/register', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: '用户名和密码必填' })
  try {
    const [exists] = await pool.query('SELECT id FROM users WHERE username=?', [username])
    if (exists.length) return res.status(400).json({ message: '用户已存在' })
    const hashed = await bcrypt.hash(password, 10)
    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed])
    res.json({ message: '注册成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '服务器错误' })
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username=?', [username])
    if (!rows.length) return res.status(400).json({ message: '用户不存在' })
    const ok = await bcrypt.compare(password, rows[0].password)
    if (!ok) return res.status(400).json({ message: '密码错误' })
    const token = jwt.sign({ id: rows[0].id, username }, process.env.JWT_SECRET, { expiresIn: '2h' })
    res.json({ token })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '服务器错误' })
  }
})

export default router
