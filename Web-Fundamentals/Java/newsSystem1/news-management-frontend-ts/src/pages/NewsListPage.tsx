import React, { useState, useEffect } from 'react';
import { getAllNews } from '../api/newsApi';
import { News } from '../types/types';
import './NewsListPage.css';

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

    if (loading) return (
        <div className="flex-center" style={{ height: '50vh' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>加载中...</div>
        </div>
    );

    if (error) return (
        <div className="container">
            <div className="card" style={{ color: '#ef4444', textAlign: 'center' }}>
                错误: {error}
            </div>
        </div>
    );

    return (
        <div className="container">
            <h2 className="text-center" style={{ marginBottom: '2rem', fontSize: '2rem' }}>最新动态</h2>
            {news.length === 0 ? (
                <div className="empty-state">
                    <p>暂无新闻，请管理员添加。</p>
                </div>
            ) : (
                <div className="news-grid">
                    {news.map((item) => (
                        <div key={item.id} className="card news-card">
                            <div>
                                <h3>{item.title}</h3>
                                <p>{item.content.length > 150 ? item.content.substring(0, 150) + '...' : item.content}</p>
                            </div>
                            <div className="news-meta">
                                <span>作者: {item.author}</span>
                                <span>{new Date(item.publishDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export default NewsListPage;
