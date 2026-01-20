import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsService } from '../../services/api';

const NewsForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode && id) {
      fetchNewsItem(id);
    }
  }, [isEditMode, id]);

  const fetchNewsItem = async (newsId: string) => {
    try {
      const response = await newsService.getNewsById(newsId);
      const newsItem = response.data.data;
      setTitle(newsItem.title);
      setContent(newsItem.content);
    } catch (err: any) {
      setError('无法获取新闻信息');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { Title: title, Content:content };
      if (isEditMode && id) {
        await newsService.updateNews(id, payload);
      } else {
        await newsService.createNews(payload);
      }
      navigate('/news');
    } catch (err: any) {
      setError('操作失败，请重试');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        {isEditMode ? '编辑新闻' : '发布新闻'}
      </h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            required
          ></textarea>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/news')}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-300"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {isEditMode ? '保存修改' : '发布'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;