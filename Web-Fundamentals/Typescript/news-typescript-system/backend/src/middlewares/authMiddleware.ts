import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 扩展 Request 类型，以包含 user 属性
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// 身份验证中间件
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 从请求头中获取 token
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('未授权：缺少令牌');
  }

  // 令牌格式通常是 "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send('未授权：令牌格式无效');
  }

  try {
    // 验证 JWT
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret);
    
    // 将解码后的用户信息添加到请求对象中
    req.user = decoded;
    
    // 继续处理下一个中间件或路由
    next();
  } catch (err) {
    console.error('令牌验证失败:', err);
    return res.status(401).send('未授权：令牌无效');
  }
};

export default authMiddleware;