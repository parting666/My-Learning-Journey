#!/bin/bash

# 定义项目目录名
PROJECT_DIR="news-management-frontend-ts"

# 检查目录是否已存在
if [ -d "$PROJECT_DIR" ]; then
    echo "错误：目录 $PROJECT_DIR 已存在。请先删除或改名。"
    exit 1
fi

echo "--- 正在创建 TypeScript 前端项目目录结构 ---"

# 创建主目录和核心子目录
mkdir -p "$PROJECT_DIR"/src/{api,components,context,pages,types}

# 切换到项目目录
cd "$PROJECT_DIR" || exit 1

# --- 1. package.json (更新依赖以支持 TS) ---
echo "--- 创建 package.json ---"
cat > package.json << EOF
{
  "name": "news-management-frontend-ts",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1",
    "axios": "^1.7.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/react-router-dom": "^5.3.3",
    "@typescript-eslint/eslint-plugin": "^7.13.0",
    "@typescript-eslint/parser": "^7.13.0",
    "@vitejs/plugin-react": "^4.3.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.7",
    "typescript": "^5.4.5",
    "vite": "^5.2.13"
  }
}
EOF

# --- 2. tsconfig.json ---
echo "--- 创建 tsconfig.json ---"
cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOMAclases"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# --- 3. types/types.ts ---
echo "--- 创建 types/types.ts ---"
cat > src/types/types.ts << EOF
// --- API 交互类型 ---

export interface News {
  id: number;
  title: string;
  content: string;
  author: string;
  publishDate: string; // 后端返回的 ISO 格式日期字符串
}

export interface RegisterRequest {
  username?: string;
  password?: string;
  email?: string;
}

export interface LoginRequest {
  username?: string;
  password?: string;
}

export type AuthToken = string;

// --- Context 状态类型 ---

export interface AuthContextType {
  token: AuthToken | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, email: string) => Promise<boolean>;
  logout: () => void;
}
EOF

# --- 4. API 文件 (.ts) ---
echo "--- 创建 api 文件 ---"
cat > src/api/authApi.ts << EOF
import axios from 'axios';
import { LoginRequest, RegisterRequest, AuthToken } from '../types/types';

const API_URL = 'http://localhost:8080/api/auth';

export const login = (data: LoginRequest) => {
    return axios.post<AuthToken>(`${API_URL}/login`, data);
};

export const register = (data: RegisterRequest) => {
    return axios.post<void>(`${API_URL}/register`, data);
};
EOF

cat > src/api/newsApi.ts << EOF
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
        config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const getAllNews = () => {
    return api.get<News[]>('/');
};

export const createNews = (newsData: Omit<News, 'id' | 'publishDate'>) => {
    return api.post<News>('/', newsData);
};

export const updateNews = (id: number, newsData: Omit<News, 'id' | 'publishDate'>) => {
    return api.put<News>(\`/\${id}\`, newsData);
};

export const deleteNews = (id: number) => {
    return api.delete<void>(\`/\${id}\`);
};
EOF


# --- 5. Context 文件 (.tsx) ---
echo "--- 创建 context/AuthContext.tsx ---"
cat > src/context/AuthContext.tsx << EOF
import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
import { login, register } from '../api/authApi';
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
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
    const [loading, setLoading] = useState<boolean>(false);

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

    const handleRegister = async (username: string, password: string, email: string): Promise<boolean> => {
        try {
            await register({ username, password, email });
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
EOF


# --- 6. Components 文件 (.tsx) ---
echo "--- 创建 components/Header.tsx ---"
cat > src/components/Header.tsx << EOF
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <header style={{ padding: '15px 20px', background: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>TS 新闻管理系统</Link></h1>
            <nav>
                <Link to="/" style={{ color: 'white', margin: '0 15px' }}>新闻列表</Link>
                {isAuthenticated ? (
                    <>
                        <Link to="/manage" style={{ color: 'white', margin: '0 15px' }}>管理新闻</Link>
                        <button onClick={logout} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>登出</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'white', margin: '0 15px' }}>登录</Link>
                        <Link to="/register" style={{ color: 'white', margin: '0 15px' }}>注册</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
EOF

cat > src/components/PrivateRoute.tsx << EOF
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>认证加载中...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
EOF


# --- 7. Pages 文件 (.tsx) ---
echo "--- 创建 pages/LoginPage.tsx ---"
cat > src/pages/LoginPage.tsx << EOF
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
        <div className="container">
            <h2>用户登录</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>用户名:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>密码:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? '登录中...' : '登录'}
                </button>
            </form>
            <p>还没有账号？<a style={{cursor: 'pointer', color: '#007bff'}} onClick={() => navigate('/register')}>去注册</a></p>
        </div>
    );
};

export default LoginPage;
EOF

cat > src/pages/RegisterPage.tsx << EOF
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await register(username, password, email);
            alert('注册成功！已自动登录并跳转。');
            navigate('/manage');
        } catch (err) {
            setError((err as Error).message || '注册失败。');
        }
    };

    return (
        <div className="container">
            <h2>用户注册</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>用户名:</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>邮箱:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>密码:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? '注册中...' : '注册并登录'}
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
EOF

cat > src/pages/NewsListPage.tsx << EOF
import React, { useState, useEffect } from 'react';
import { getAllNews } from '../api/newsApi';
import { News } from '../types/types';

const NewsListPage: React.FC = () => {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await getAllNews();
                setNews(response.data);
            } catch (err) {
                setError('获取新闻列表失败。');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) return <div className="container">加载中...</div>;
    if (error) return <div className="container" style={{ color: 'red' }}>错误: {error}</div>;

    return (
        <div className="container">
            <h2>最新新闻</h2>
            {news.length === 0 ? (
                <p>暂无新闻，请管理员添加。</p>
            ) : (
                <div className="news-list">
                    {news.map((item) => (
                        <div key={item.id} className="news-item" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                            <h3>{item.title}</h3>
                            <p>{item.content.substring(0, 150)}...</p>
                            <small>作者: {item.author} | 发布日期: {new Date(item.publishDate).toLocaleDateString()}</small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewsListPage;
EOF

cat > src/pages/ManageNewsPage.tsx << EOF
import React, { useState, useEffect } from 'react';
import { getAllNews, createNews, updateNews, deleteNews } from '../api/newsApi';
import { News } from '../types/types';

type NewsForm = Omit<News, 'id' | 'publishDate'>;

const emptyForm: NewsForm = { title: '', content: '', author: '' };

const ManageNewsPage: React.FC = () => {
    const [news, setNews] = useState<News[]>([]);
    const [form, setForm] = useState<NewsForm>(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchNews = async () => {
        try {
            const response = await getAllNews();
            setNews(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch news:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId !== null) {
                await updateNews(editingId, form);
                alert('新闻更新成功!');
            } else {
                await createNews(form);
                alert('新闻创建成功!');
            }
            setForm(emptyForm);
            setEditingId(null);
            fetchNews(); 
        } catch (error) {
            alert('操作失败，请确认您已登录并拥有权限。');
            console.error("Save failed:", error);
        }
    };

    const handleEdit = (item: News) => {
        const { id, publishDate, ...rest } = item; 
        setForm(rest);
        setEditingId(id);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('确定要删除这条新闻吗?')) {
            try {
                await deleteNews(id);
                alert('新闻删除成功!');
                fetchNews();
            } catch (error) {
                alert('删除失败，请确认您已登录并拥有权限。');
                console.error("Delete failed:", error);
            }
        }
    };

    if (loading) return <div className="container">加载中...</div>;

    return (
        <div className="container">
            <h2>新闻管理 (管理员)</h2>

            <form onSubmit={handleSave} style={{ border: '1px dashed #007bff', padding: '20px', marginBottom: '30px' }}>
                <h3>{editingId !== null ? '编辑新闻' : '发布新新闻'}</h3>
                <div>
                    <label>标题:</label>
                    <input name="title" value={form.title} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>作者:</label>
                    <input name="author" value={form.author} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>内容:</label>
                    <textarea name="content" value={form.content} onChange={handleInputChange} required rows={5} />
                </div>
                <button type="submit">{editingId !== null ? '保存更改' : '发布'}</button>
                {editingId !== null && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>取消编辑</button>}
            </form>

            <h3>已发布新闻列表</h3>
            {news.map((item) => (
                <div key={item.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <strong>{item.title}</strong>
                        <p style={{ margin: '5px 0', fontSize: '12px' }}>ID: {item.id}</p>
                    </div>
                    <div>
                        <button onClick={() => handleEdit(item)} style={{ marginRight: '10px' }}>编辑</button>
                        <button onClick={() => handleDelete(item.id)}>删除</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ManageNewsPage;
EOF

# --- 8. 根文件 (.tsx) ---
echo "--- 创建 src/App.tsx ---"
cat > src/App.tsx << EOF
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import NewsListPage from './pages/NewsListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ManageNewsPage from './pages/ManageNewsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<NewsListPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="/manage" element={<ManageNewsPage />} />
            </Route>

            <Route path="*" element={<div className="container"><h1>404 Not Found</h1></div>} />
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  );
}

export default App;
EOF

cat > src/main.tsx << EOF
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
EOF

# --- 9. 创建 Vite 配置和基础样式文件 ---
echo "--- 创建 vite.config.ts 和 index.css ---"
cat > vite.config.ts << EOF
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
EOF

cat > src/index.css << EOF
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f4f4f4;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

.container { 
  max-width: 1200px; 
  margin: 20px auto; 
  padding: 20px; 
  background: white; 
  border-radius: 8px; 
  box-shadow: 0 0 10px rgba(0,0,0,0.1); 
}

/* 简单的表单样式 */
form div {
    margin-bottom: 15px;
}
form label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}
form input, form textarea {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
}
form button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
}
form button:hover:not(:disabled) {
    background-color: #0056b3;
}
EOF

echo "--- TypeScript 前端文件创建完成！ ---"

# 退出脚本所在的目录
cd ..
