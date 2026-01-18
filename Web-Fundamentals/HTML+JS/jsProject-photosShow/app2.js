const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
// 定义端口
const PORT = process.env.PORT || 3000;



 
async function getphotos() {
  try {
    const response = await axios.get('https://picsum.photos/v2/list');
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    return null
  }
}
// 模拟数据库
const products = [
   
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  },
  {
    "userId": 1,
    "id": 2,
    "title": "qui est esse",
    "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
  },
  {
    "userId": 1,
    "id": 3,
    "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
  },
  {
    "userId": 1,
    "id": 4,
    "title": "eum et est occaecati",
    "body": "ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit"
  },
  {
    "userId": 1,
    "id": 5,
    "title": "nesciunt quas odio",
    "body": "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque"
  }
];

// 创建服务器
const server = http.createServer(async (req, res) => {
  // 解析请求URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // 设置默认响应头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // 路由处理
  switch (true) {
    // 首页路由
    case pathname === '/' && method === 'GET':
      res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
      res.end('欢迎来到我的Node.js服务器!\n访问 /api/products 查看产品列表');
      break;
    case pathname.match(/^\/api\/news\/(\d+)$/) && method === 'GET':
  const newsId = parseInt(pathname.split('/')[3]);
  const newsItem = news.find(n => n.id === newsId);
  if (newsItem) {
    res.writeHead(200);
    res.end(JSON.stringify(newsItem));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: '新闻未找到' }));
  }
  break;   
 
    // 获取所有产品
    case pathname === '/api/products' && method === 'GET':

    const photos= await getphotos()
    console.log("photos:",photos)
      res.writeHead(200);
      res.end(JSON.stringify(products));
      break;

    // 获取单个产品
    case pathname.match(/^\/api\/products\/(\d+)$/) && method === 'GET':
      const id = parseInt(pathname.split('/')[3]);
      const product = products.find(p => p.id === id);
      
      if (product) {
        res.writeHead(200);
        res.end(JSON.stringify(product));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: '产品未找到' }));
      }
      break;

    // 404 路由
    default:
      res.writeHead(404);
      res.end(JSON.stringify({ message: '请求的资源不存在' }));
  }
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('按 Ctrl+C 停止服务器');
});
