const express = require('express');
const axios = require('axios');
//const cors = require('cors'); // 需安装：npm install cors

const app = express();
//app.use(cors()); // 处理跨域

// 从 picsum 获取图片数据
async function getphotos() {
  try {
    const response = await axios.get('https://picsum.photos/v2/list');
    return response.data;
  } catch (error) {
    console.error('获取图片数据失败：', error.message);
    return null;
  }
}

// 首页接口
app.get('/', (req, res) => {
  res.send({
    code: 200,
    message: '欢迎访问图片服务器',
    data: 'Hello World'
  });
});

// 图片列表接口
app.get('/photos', async (req, res) => {
  const photosbox = await getphotos();
  if (photosbox) {
    res.send({
      code: 200,
      message: 'success',
      data: photosbox
    });
  } else {
    res.status(500).send({
      code: 500,
      message: '获取图片数据失败',
      data: null
    });
  }
});

// 未匹配路由处理
// app.all('*', (req, res) => {
//   res.status(404).send({
//     code: 404,
//     message: '请访问正确的地址',
//     data: null
//   });
// });

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`图片服务器运行在 http://localhost:${PORT}`);
  console.log('按 Ctrl+C 停止服务器');
});