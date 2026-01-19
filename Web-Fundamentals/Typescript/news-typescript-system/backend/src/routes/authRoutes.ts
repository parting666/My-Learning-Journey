import express from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { register, login } from '../controllers/authController';
import { getNews, createNews, updateNews, deleteNews } from '../controllers/newsController';

const router = express.Router();

 

router.post('/register', register);
router.post('/login', login);


export default router;