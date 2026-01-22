// src/api/authApi.ts

import axios from 'axios';
import { LoginRequest, RegisterRequest, AuthToken } from '../types/types';

// 这是正确的后端 API 基础 URL
const API_URL = 'http://localhost:8080/api/auth';

export const login = (data: LoginRequest) => {

    return axios.post<AuthToken>(`${API_URL}/login`, data);
};

export const register = (data: RegisterRequest) => {

    return axios.post<void>(`${API_URL}/register`, data);
};