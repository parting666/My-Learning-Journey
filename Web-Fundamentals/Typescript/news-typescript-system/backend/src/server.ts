import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createNewsTable } from './models/newsModel';
import { createUserTable } from './models/userModel';
import authRoutes from './routes/authRoutes';
import newsRoutes from './routes/newsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 创建数据库表
createUserTable();
createNewsTable();

app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});