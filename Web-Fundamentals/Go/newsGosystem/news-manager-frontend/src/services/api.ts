import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { ApiResponse, AuthData, News, NewsAdd } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (data: any) => api.post<ApiResponse<AuthData>>('/login', data),
  register: (data: any) => api.post<ApiResponse<void>>('/register', data),
};

export const newsService = {
  getNews: () => api.get<{ data: News[] }>('/news'),
  getNewsById: (id: string) => api.get<{ data: News }>(`/news/${id}`),
  createNews: (data: Partial<NewsAdd>) => api.post<ApiResponse<any>>('/news', data),
  updateNews: (id: string, data: Partial<NewsAdd>) => api.put<{ data: NewsAdd }>(`/news/${id}`, data),
  deleteNews: (id: string) => api.delete<{ data: null }>(`/news/${id}`),
};