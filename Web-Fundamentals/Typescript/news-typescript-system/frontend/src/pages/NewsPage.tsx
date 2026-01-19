import React, { useState, useEffect } from 'react';
import { getNews, createNews, updateNews, deleteNews } from '../api/api';
import NewsForm from '../components/NewsForm';
import NewsList from '../components/NewsList';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const NewsPage = ({ onLogout }: { onLogout: () => void }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchNews = async () => {
    try {
      const response = await getNews({ page, search });
      setNews(response.data);
    } catch (err) {
      console.error('Failed to fetch news:', err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page, search, editingNews]);

  const handleCreateOrUpdate = async (data: any) => {
    try {
      if (editingNews && editingNews.id) {
        await updateNews(editingNews.id, data);
        setEditingNews(null);
      } else {
        await createNews(data);
      }
      fetchNews();
    } catch (err) {
      console.error('Failed to save news:', err);
    }
  };

  const handleLogout = () => {
    // 移除 localStorage 中的 token
    localStorage.removeItem('token');
    onLogout();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNews(id);
      fetchNews();
    } catch (err) {
      console.error('Failed to delete news:', err);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center py-4 mb-6 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-800">新闻管理系统</h1>
        <button onClick={onLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200">
          退出登录
        </button>
      </div>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">{editingNews ? '编辑新闻' : '发布新新闻'}</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="搜索新闻..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <NewsForm onSave={handleCreateOrUpdate} news={editingNews} />
      </div>

      <NewsList news={news} onEdit={setEditingNews} onDelete={handleDelete} />

      <div className="flex justify-center items-center mt-8">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l transition duration-200"
        >
          上一页
        </button>
        <span className="bg-gray-200 text-gray-800 font-semibold py-2 px-4">第 {page} 页</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r transition duration-200"
        >
          下一页
        </button>
      </div>
    </div>
  );
};

export default NewsPage;