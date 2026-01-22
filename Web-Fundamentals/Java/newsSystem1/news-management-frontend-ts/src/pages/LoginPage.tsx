import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPages.css';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/manage');
        } catch (err) {
            setError((err as Error).message || '登录失败，请检查用户名或密码。');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>用户登录</h2>
                {error && <p className="text-danger text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>用户名</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="请输入用户名"
                            required
                        />
                    </div>
                    <div>
                        <label>密码</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="请输入密码"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} style={{ width: '100%' }}>
                        {loading ? '登录中...' : '登录'}
                    </button>
                </form>
                <div className="auth-footer">
                    还没有账号？<Link to="/register">立即注册</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
