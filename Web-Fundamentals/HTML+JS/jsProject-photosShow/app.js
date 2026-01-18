const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// 定义端口
const PORT = process.env.PORT || 3000;

// 模拟数据库
const products = [
  { id: 1, name: 'Node.js 入门指南', price: 49.99 },
  { id: 2, name: 'JavaScript 高级编程', price: 79.99 },
  { id: 3, name: 'Web 开发实战', price: 69.99 }
];

// 创建服务器
const server = http.createServer((req, res) => {
  // 解析请求URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // 设置默认响应头
  res.setHeader('Content-Type', 'application/json');

  // 路由处理
  switch (true) {
    // 首页路由
    case pathname === '/' && method === 'GET':
      res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
      res.end('欢迎来到我的Node.js服务器!\n访问 /api/products 查看产品列表');
      break;

    // 获取所有产品
    case pathname === '/api/products' && method === 'GET':
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
