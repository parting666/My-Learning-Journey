import React, { useState, useEffect } from 'react';
import { getNewsList } from '../services/api';
import { News } from '../types';
import Pagination from '../components/Pagination';

const Home = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchNews();
  }, [page, keyword]);

  const fetchNews = async () => {
    try {
      const response = await getNewsList(page, 10, keyword);
      // 后端返回的应该包含分页信息
      const totalCount = parseInt(response.headers['x-total-count'] || '0'); // 假设后端在 header 中返回总数
      setNewsList(response.data);
      setTotalPages(Math.ceil(totalCount / 10));
    } catch (error) {
      console.error('获取新闻失败:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // 搜索时重置到第一页
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">最新新闻</h1>
      <form onSubmit={handleSearch} className="mb-8 max-w-lg mx-auto">
        <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索新闻..."
            className="w-full p-3 pl-6 focus:outline-none"
          />
          <button type="submit" className="bg-blue-500 text-white px-6 py-3 hover:bg-blue-600">搜索</button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsList.map((news) => (
          <div key={news.id} className="bg-white p-6 shadow-md rounded-lg transform transition-transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{news.title}</h2>
            <p className="text-gray-600 line-clamp-3">{news.content}</p>
            <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
              <span>作者: {news.author}</span>
              <span>发布时间: {new Date(news.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default Home;