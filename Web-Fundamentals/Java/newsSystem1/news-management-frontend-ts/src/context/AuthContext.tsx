// src/context/AuthContext.tsx

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
// 确保路径和扩展名正确
import { login, register } from '../api/authApi.ts';
import { AuthContextType } from '../types/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth 必须在 AuthProvider 内部使用');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // 从本地存储初始化 Token 状态
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
    const [loading, setLoading] = useState<boolean>(false);

    // 核心修复：Axios 请求拦截器
    useEffect(() => {
        let interceptorId: number | null = null;

        if (token) {
            // 1. 如果有 Token，添加请求拦截器
            interceptorId = axios.interceptors.request.use((config) => {
                // 确保请求头中包含 Authorization: Bearer <Token>
                if (!config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            }, (error) => {
                return Promise.reject(error);
            });
        }

        // 2. 清理函数：在组件卸载或 token 变化时移除拦截器
        return () => {
            if (interceptorId !== null) {
                axios.interceptors.request.eject(interceptorId);
            }
        };
    }, [token]);

    const handleLogin = async (username: string, password: string): Promise<boolean> => {
        setLoading(true);
        try {
            const response = await login({ username, password });
            const newToken = response.data;

            localStorage.setItem('token', newToken);
            setToken(newToken);
            setIsAuthenticated(true);

            setLoading(false);
            return true;
        } catch (error) {
            setLoading(false);
            console.error("Login failed", error);
            throw new Error(axios.isAxiosError(error) ? (error.response?.data || error.message) : 'Login failed');
        }
    };

    const handleRegister = async (username: string, password: string): Promise<boolean> => {
        try {
            await register({ username, password });
            return await handleLogin(username, password);
        } catch (error) {
            console.error("Registration failed", error);
            throw new Error(axios.isAxiosError(error) ? (error.response?.data || error.message) : 'Registration failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
    };

    const value: AuthContextType = {
        token,
        isAuthenticated,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};