import { Router } from 'express'
import { pool } from '../db.js'
import { authRequired } from '../middleware/auth.js'

const router = Router()

// 获取新闻列表（可筛选：状态/分类/搜索）
router.get('/', async (req, res) => {
  const { status, category, search } = req.query
  let sql = `
    SELECT n.id, n.title, n.content, n.author, n.status, n.created_at, n.updated_at,
           c.name as category, u.username as created_by
    FROM news n
    LEFT JOIN categories c ON n.category_id=c.id
    LEFT JOIN users u ON n.user_id=u.id
    WHERE 1=1
  `
  const params = []
  if (status && ['draft','published'].includes(status)) {
    sql += ' AND n.status = ?'
    params.push(status)
  }
  if (category && category !== '全部') {
    sql += ' AND c.name = ?'
    params.push(category)
  }
  if (search) {
    sql += ' AND n.title LIKE ?'
    params.push(`%${search}%`)
  }
  sql += ' ORDER BY n.created_at DESC'
  try {
    const [rows] = await pool.query(sql, params)
    res.json(rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 获取详情
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT n.*, c.name as category, u.username as created_by
      FROM news n
      LEFT JOIN categories c ON n.category_id=c.id
      LEFT JOIN users u ON n.user_id=u.id
      WHERE n.id=?
    `, [req.params.id])
    if (!rows.length) return res.status(404).json({ message: '未找到' })
    res.json(rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 新建
router.post('/', authRequired, async (req, res) => {
  const { title, content, author, category, status } = req.body
  if (!title || !content || !author || !category) {
    return res.status(400).json({ message: '必填字段缺失' })
  }
  try {
    const [[cat]] = await pool.query('SELECT id FROM categories WHERE name=?', [category])
    const category_id = cat ? cat.id : null
    await pool.query(`
      INSERT INTO news (title, content, author, category_id, status, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [title, content, author, category_id, status || 'draft', req.user.id])
    res.json({ message: '创建成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 更新
router.put('/:id', authRequired, async (req, res) => {
  const { title, content, author, category, status } = req.body
  try {
    const [[cat]] = await pool.query('SELECT id FROM categories WHERE name=?', [category])
    const category_id = cat ? cat.id : null
    const [r] = await pool.query(`
      UPDATE news SET title=?, content=?, author=?, category_id=?, status=?
      WHERE id=? AND user_id=?
    `, [title, content, author, category_id, status || 'draft', req.params.id, req.user.id])
    if (!r.affectedRows) return res.status(403).json({ message: '无权限或数据不存在' })
    res.json({ message: '更新成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 删除
router.delete('/:id', authRequired, async (req, res) => {
  try {
    const [r] = await pool.query('DELETE FROM news WHERE id=? AND user_id=?', [req.params.id, req.user.id])
    if (!r.affectedRows) return res.status(403).json({ message: '无权限或数据不存在' })
    res.json({ message: '删除成功' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: '服务器错误' })
  }
})

export default router
