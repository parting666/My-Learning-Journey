import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { getNewsList, createNews, updateNews, deleteNews } from '../services/api';
import { News } from '../types';

const Admin = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [form, setForm] = useState({ id: 0, title: '', content: '', author: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchNews();
  }, [token, navigate]);

  const fetchNews = async () => {
    try {
      const response = await getNewsList(1, 100); // 在后台管理页面不分页，获取所有新闻
      setNews(response.data);
    } catch (err) {
      console.error('获取新闻失败', err);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateNews(form.id, form);
      } else {
        await createNews(form);
      }
      resetForm();
      fetchNews();
    } catch (err) {
      console.error('操作失败', err);
    }
  };

  const handleEdit = (newsItem: News) => {
    setForm(newsItem);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定删除这篇新闻吗？')) {
      try {
        await deleteNews(id);
        fetchNews();
      } catch (err) {
        console.error('删除失败', err);
      }
    }
  };

  const resetForm = () => {
    setForm({ id: 0, title: '', content: '', author: '' });
    setIsEditing(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">新闻管理后台</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {/* 新闻表单 */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">{isEditing ? '编辑新闻' : '新增新闻'}</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">标题</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">作者</label>
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">内容</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleFormChange}
                className="w-full p-2 border rounded h-32"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                {isEditing ? '更新' : '发布'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded ml-2 hover:bg-gray-600 transition"
                >
                  取消
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* 新闻列表 */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">新闻列表</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布时间</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {news.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900">编辑</button>
                      <button onClick={() => handleDelete(item.id)} className="ml-4 text-red-600 hover:text-red-900">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;