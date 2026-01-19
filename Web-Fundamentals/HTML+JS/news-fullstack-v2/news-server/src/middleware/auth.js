import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export function authRequired(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ message: '未授权' })
  try {
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (e) {
    return res.status(401).json({ message: '无效token' })
  }
}
