import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPages.css';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await register(username, password);
            alert('注册成功！已自动登录并跳转。');
            navigate('/manage');
        } catch (err) {
            setError((err as Error).message || '注册失败。');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>新用户注册</h2>
                {error && <p className="text-danger text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>用户名</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="设置用户名"
                            required
                        />
                    </div>
                    <div>
                        <label>密码</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="设置密码"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} style={{ width: '100%' }}>
                        {loading ? '注册中...' : '注册并登录'}
                    </button>
                </form>
                <div className="auth-footer">
                    已有账号？<Link to="/login">直接登录</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
