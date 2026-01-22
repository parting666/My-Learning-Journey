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
