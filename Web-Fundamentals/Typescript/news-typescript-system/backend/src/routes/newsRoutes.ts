import express from 'express';
// 导入 authMiddleware
import authMiddleware from '../middlewares/authMiddleware'; 
import { createNews, getNews, updateNews, deleteNews } from '../controllers/newsController';

const router = express.Router();

// 公开接口，任何人都可以获取新闻列表，无需鉴权
router.get('/', getNews);

// 需要鉴权的接口，只有通过鉴权后才能执行
router.post('/', authMiddleware, createNews);
router.put('/:id', authMiddleware, updateNews);
router.delete('/:id', authMiddleware, deleteNews);

export default router;