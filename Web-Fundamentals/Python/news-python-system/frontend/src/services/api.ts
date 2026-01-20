import axios from 'axios';
import { News, User } from '../types';
import useAuthStore from '../store/authStore';

const API_BASE_URL = 'http://127.0.0.1:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 用户认证相关API
export const login = (username: string, password: string) => {
  const form_data = new FormData();
  form_data.append('username', username);
  form_data.append('password', password);
  return api.post('/user/token', form_data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
};

export const register = (user: { username: string; email: string; password: string }) => {
  return api.post<User>('/user/register', user);
};

// 新闻管理API
export const getNewsList = (page: number, size: number, keyword: string = '') => {
  return api.get<News[]>(`/news?page=${page}&size=${size}&q=${keyword}`);
};

export const createNews = (news: { title: string; content: string; author: string }) => {
  return api.post<News>('/news', news);
};

export const updateNews = (id: number, news: { title: string; content: string; author: string }) => {
  return api.put<News>(`/news/${id}`, news);
};

export const deleteNews = (id: number) => {
  return api.delete(`/news/${id}`);
};