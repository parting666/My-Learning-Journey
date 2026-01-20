import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import useAuthStore from '../store/authStore';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ✅ 使用 URLSearchParams 创建表单数据
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      // 检查登录函数，确保它接受了正确的数据格式
      const response = await login(username, password);
      setToken(response.data.access_token); // ✅ 更新全局状态
      navigate('/admin'); // ✅ 登录成功后跳转到管理后台
      console.log("登录成功！");
    } catch (error) {
      console.error("登录失败:", error);
      // 处理错误，例如显示错误消息
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">登录</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              className="w-full p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;