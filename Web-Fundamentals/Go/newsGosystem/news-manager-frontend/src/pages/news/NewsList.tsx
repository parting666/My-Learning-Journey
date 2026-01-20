import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { newsService } from '../../services/api';
import { News } from '../../types';

const NewsList = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await newsService.getNews();
      setNews(response.data.data);
      setLoading(false);
    } catch (err: any) {
      setError('无法加载新闻列表');
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('你确定要删除这条新闻吗？')) {
      try {
        await newsService.deleteNews(id.toString());
        fetchNews();
      } catch (err: any) {
        setError('删除失败');
      }
    }
  };

  if (loading) {
    return <div className="text-center text-lg text-gray-500">正在加载新闻...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">新闻列表</h2>
      {news.length === 0 ? (
        <p className="text-center text-gray-500">目前没有新闻，<Link to="/news/create" className="text-blue-600 hover:underline">去发布一篇吧！</Link></p>
      ) : (
        <ul className="space-y-4">
          {news.map(item => (
            <li key={item.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-700">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1">发布于: {new Date(item.created_at).toLocaleDateString()}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => navigate(`/news/edit/${item.id}`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-300"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  删除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NewsList;