import { Request, Response } from 'express';
import { query } from '../utils/db';
import jwt from 'jsonwebtoken';


export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    await query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);
    res.status(201).send('User created successfully');
  } catch (err) {
    res.status(500).send('Error registering user');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' });
      
      // 登录成功，返回 token
      res.status(200).json({ token });
    } else {
      res.status(401).send('凭据无效');
    }
  } catch (err) {
    res.status(500).send('登录时出错');
  }
};