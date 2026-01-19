import { Request, Response } from 'express';
import { query } from '../utils/db';

export const createNews = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    await query('INSERT INTO news (title, content) VALUES ($1, $2)', [title, content]);
    res.status(201).send('News created successfully');
  } catch (err) {
    res.status(500).send('Error creating news');
  }
};

export const getNews = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    const text = `
      SELECT * FROM news 
      WHERE title ILIKE $1 OR content ILIKE $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3;
    `;
    const params = [`%${search}%`, parseInt(limit as string), offset];

    const result = await query(text, params);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send('Error fetching news');
  }
};

export const updateNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const { title, content } = req.body;
    console.log(req.body);
    await query('UPDATE news SET title = $1, content = $2 WHERE id = $3', [title, content, id]);
    res.status(200).send('News updated successfully');
  } catch (err) {
    res.status(500).send('Error updating news');
  }
};

export const deleteNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM news WHERE id = $1', [id]);
    res.status(200).send('News deleted successfully');
  } catch (err) {
    res.status(500).send('Error deleting news');
  }
};