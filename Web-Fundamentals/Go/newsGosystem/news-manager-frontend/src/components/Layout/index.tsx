import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Layout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">新闻管理后台</h1>
        <nav className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/news')}
            className="text-blue-600 hover:text-blue-800 transition duration-300"
          >
            新闻列表
          </button>
          <button
            onClick={() => navigate('/news/create')}
            className="text-green-600 hover:text-green-800 transition duration-300"
          >
            发布新闻
          </button>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 transition duration-300"
          >
            退出
          </button>
        </nav>
      </header>
      <main className="container mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
