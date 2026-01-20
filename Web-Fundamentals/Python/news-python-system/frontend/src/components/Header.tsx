import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Header = () => {
  const { token, setToken, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    navigate('/');
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">新闻管理系统</Link>
        <div>
          {token ? (
            <>
              <Link to="/admin" className="mr-4 hover:underline">管理后台</Link>
              <button onClick={handleLogout} className="hover:underline">登出</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4 hover:underline">登录</Link>
              <Link to="/register" className="hover:underline">注册</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;