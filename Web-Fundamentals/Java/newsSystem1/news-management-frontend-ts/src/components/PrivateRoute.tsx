// src/components/PrivateRoute.tsx

import React, { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * @PrivateRoute
 * 用于保护需要认证才能访问的路由。
 * 如果用户未认证，则重定向到登录页面。
 */
const PrivateRoute: React.FC = () => {
  // 从您的 AuthContext 中获取认证状态
  const { isAuthenticated, loading } = useAuth();

  // 如果正在加载（例如，正在检查本地存储中的 token），则显示加载中...
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-xl font-medium text-blue-600">加载中...</div>
      </div>
    );
  }

  // 如果用户未认证，重定向到 /login 页面
  if (!isAuthenticated) {
    // 使用 React Router 的 Navigate 组件进行重定向
    return <Navigate to="/login" replace />;
  }

  // 认证成功，渲染子路由
  return <Outlet />;
};

// 确保使用 export default 导出组件
export default PrivateRoute;