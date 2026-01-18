const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: 新闻
 * description: 新闻文章管理相关的API
 */

/**
 * @swagger
 * /news:
 *   get:
 *     summary: 获取新闻列表（分页和模糊查询）
 *     tags: [新闻]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页条数
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 搜索关键词（标题或内容）
 *     responses:
 *       200:
 *         description: 成功获取新闻列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       author:
 *                         type: string
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *       500:
 *         description: 获取新闻列表失败
 */
router.get('/', async (req, res) => {
    const { page = 1, pageSize = 10, keyword = '' } = req.query;
    const offset = (page - 1) * pageSize;
    const searchKeyword = `%${keyword}%`;

    try {
        const getDataSql = `
            SELECT n.id, n.title, n.content, n.created_at, n.image_url,n.image_urls ,u.username as author
            FROM news n
            JOIN users u ON n.author_id = u.id
            WHERE n.title LIKE ? OR n.content LIKE ?
            ORDER BY n.created_at DESC
            LIMIT ?
            OFFSET ?
        `;

        const getCountSql = `
            SELECT COUNT(*) as total
            FROM news
            WHERE title LIKE ? OR content LIKE ?
        `;


        const [data] = await db.query(getDataSql, [searchKeyword, searchKeyword, parseInt(pageSize), parseInt(offset)]);
        const [countResult] = await db.query(getCountSql, [searchKeyword, searchKeyword]);

        res.json({
            list: data,
            total: countResult[0].total,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
        });

    } catch (error) {
        console.error('获取新闻列表失败:', error);
        res.status(500).json({ message: '服务器错误', error: error.message });
    }
});

/**
 * @swagger
 * /news:
 *   post:
 *     summary: 新增新闻
 *     tags: [新闻]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: 新闻标题
 *               content:
 *                 type: string
 *                 description: 新闻内容
 *               image_url:
 *                 type: string
 *                 description: 图片URL
 *               image_urls:
 *                 type: string
 *                 description: 多图URL
 *     responses:
 *       201:
 *         description: 新闻发布成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: integer
 *       400:
 *         description: 标题和内容不能为空
 *       401:
 *         description: 认证失败，无Token或Token无效
 *       500:
 *         description: 服务器错误
 */
router.post('/', authMiddleware, async (req, res) => {
    const { title, content, image_url, image_urls } = req.body;
    const author_id = req.user.id;

    if (!title || !content) {
        return res.status(400).json({ message: '标题和内容不能为空' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO news (title, content, author_id, image_url,image_urls) VALUES (?, ?, ?,?,?)',
            [title, content, author_id, image_url, image_urls]
        );
        res.status(201).json({ message: '新闻发布成功', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: '服务器错误' });
    }
});

/**
 * @swagger
 * /news/{id}:
 *   put:
 *     summary: 更新新闻
 *     tags: [新闻]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 新闻ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 新闻标题
 *               content:
 *                 type: string
 *                 description: 新闻内容
 *               image_url:
 *                 type: string
 *                 description: 图片URL
 *               image_urls:
 *                 type: string
 *                 description: 多图URL
 *     responses:
 *       200:
 *         description: 新闻更新成功
 *       401:
 *         description: 认证失败，无Token或Token无效
 *       403:
 *         description: 无权修改此新闻
 *       500:
 *         description: 服务器错误
 */
router.put('/:id', authMiddleware, async (req, res) => {
    const newsId = req.params.id;
    const { title, content, image_url, image_urls } = req.body;
    const userId = req.user.id;

    try {
        const [news] = await db.query('SELECT author_id FROM news WHERE id = ?', [newsId]);
        if (news.length === 0 || news[0].author_id !== userId) {
            return res.status(403).json({ message: '无权修改此新闻' });
        }
        await db.query('UPDATE news SET title = ?, content = ?, image_url=? ,image_urls=? WHERE id = ?', [title, content, image_url, image_urls, newsId]);
        res.json({ message: '新闻更新成功' });
    } catch (error) {
        res.status(500).json({ message: '服务器错误' });
    }
});

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: 删除新闻
 *     tags: [新闻]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 新闻ID
 *     responses:
 *       200:
 *         description: 新闻删除成功
 *       401:
 *         description: 认证失败，无Token或Token无效
 *       403:
 *         description: 无权删除此新闻
 *       500:
 *         description: 服务器错误
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    const newsId = req.params.id;
    const userId = req.user.id;

    try {
        const [news] = await db.query('SELECT author_id FROM news WHERE id = ?', [newsId]);
        if (news.length === 0 || news[0].author_id !== userId) {
            return res.status(403).json({ message: '无权删除此新闻' });
        }
        await db.query('DELETE FROM news WHERE id = ?', [newsId]);
        res.json({ message: '新闻删除成功' });
    } catch (error) {
        res.status(500).json({ message: '服务器错误' });
    }
});

module.exports = router;