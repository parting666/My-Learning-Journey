import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <header className="header">
            <h1>
                <Link to="/" className="header-logo">
                    TS News
                </Link>
            </h1>
            <nav className="header-nav">
                <Link to="/" className="nav-link">新闻列表</Link>
                {isAuthenticated ? (
                    <>
                        <Link to="/manage" className="nav-link">管理新闻</Link>
                        <button onClick={logout} className="btn-logout">登出</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">登录</Link>
                        <Link to="/register" className="nav-link">注册</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
