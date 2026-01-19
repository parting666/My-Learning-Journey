import { useState,useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import NewsPage from './pages/NewsPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsRegistering(false); // 登录成功后回到非注册状态
  };

  const handleRegisterSuccess = () => {
    alert('注册成功，请登录！');
    setIsRegistering(false); // 注册成功后回到登录页面
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <NewsPage onLogout={handleLogout} />;
  }

  if (isRegistering) {
    return (
      <RegisterPage onRegisterSuccess={handleRegisterSuccess} />
    );
  }

  return <LoginPage onLoginSuccess={handleLoginSuccess} onToggleRegister={() => setIsRegistering(true)} />;
}

export default App;