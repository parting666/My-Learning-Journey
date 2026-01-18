const jwt = require('jsonwebtoken');
const JWT_SECRET = 'h1TQVlzcpqdqFV-vcTDL1NFwJgOs8fXuVQ0Ptf6U';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: '认证失败，无Token' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // 将解码后的用户信息附加到请求对象上
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token无效' });
    }
};

module.exports = authMiddleware;