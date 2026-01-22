import axios from 'axios';
import { News } from '../types/types';

const API_URL = 'http://localhost:8080/api/news';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const getAllNews = () => {
    return api.get<News[]>('');
};

export const createNews = (newsData: Omit<News, 'id' | 'publishDate'>) => {
    return api.post<News>('', newsData);
};

export const updateNews = (id: number, newsData: Omit<News, 'id' | 'publishDate'>) => {
    return api.put<News>(`/${id}`, newsData);
};

export const deleteNews = (id: number) => {
    return api.delete<void>(`/${id}`);
};
