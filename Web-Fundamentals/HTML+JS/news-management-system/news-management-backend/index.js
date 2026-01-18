require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); // 引入新的路由

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/upload', uploadRoutes);

// Swagger 文档路由
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 根路由
app.get('/', (req, res) => {
  res.send('新闻管理系统API正在运行...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});