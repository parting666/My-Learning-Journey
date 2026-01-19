import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // 你的后端地址
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = (data: any) => api.post('/auth/login', data);
export const register = (data: any) => api.post('/auth/register', data);
export const getNews = (params: any) => api.get('/news', { params });
export const createNews = (data: any) => api.post('/news', data);
export const updateNews = (id: number, data: any) => api.put(`/news/${id}`, data);
export const deleteNews = (id: number) => api.delete(`/news/${id}`);