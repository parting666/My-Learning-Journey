// src/pages/ManageNewsPage.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAllNews, createNews, updateNews, deleteNews } from '../api/newsApi'; // Removed .ts extension for cleanness if handled by bundler, but respecting user file structure I can keep it or let resolution handle it. The previous file had .ts, I will keep .ts if it was there to avoid resolution errors, but usually valid TS import shouldn't have .ts? Wait, previous context had .ts. I'll stick to standard import.
import { News } from '../types/types';
import './ManageNewsPage.css';

// 类型定义
type NewsForm = Omit<News, 'id' | 'publishDate'>;

// 初始空表单
const emptyForm: NewsForm = { title: '', content: '', author: '' };

// 模态框状态类型
interface DialogState {
    isOpen: boolean;
    title: string;
    message: string;
    isConfirm: boolean;
    onConfirm?: () => void;
}

/**
 * @ManageNewsPage
 * 用于管理员发布、编辑和删除新闻。
 * 所有操作都需要认证（登录用户）。
 */
const ManageNewsPage: React.FC = () => {
    const [news, setNews] = useState<News[]>([]);
    const [form, setForm] = useState<NewsForm>(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    // 自定义模态框状态
    const [dialog, setDialog] = useState<DialogState>({
        isOpen: false,
        title: '',
        message: '',
        isConfirm: false
    });

    // 关闭模态框
    const closeDialog = () => {
        setDialog({ isOpen: false, title: '', message: '', isConfirm: false });
    };

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await getAllNews();
            setNews(response.data);
        } catch (error) {
            console.error("Failed to fetch news:", error);
        } finally {
            setLoading(false);
        }
    };

    // 在组件加载时获取新闻列表
    useEffect(() => {
        fetchNews();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId !== null) {
                // PUT 请求
                await updateNews(editingId, form);
                setDialog({ isOpen: true, title: '成功', message: '新闻更新成功!', isConfirm: false });
            } else {
                // POST 请求
                await createNews(form);
                setDialog({ isOpen: true, title: '成功', message: '新闻创建成功!', isConfirm: false });
            }
            setForm(emptyForm);
            setEditingId(null);
            fetchNews();
        } catch (error) {
            let errorMessage = '操作失败，请确认您已登录。';
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                errorMessage = '权限不足。请检查您的登录状态和权限。';
            }
            setDialog({ isOpen: true, title: '错误', message: errorMessage, isConfirm: false });
            console.error("Save failed:", error);
        }
    };

    const handleEdit = (item: News) => {
        const { id, publishDate, ...rest } = item;
        setForm(rest);
        setEditingId(id);
    };

    const confirmDelete = async (id: number) => {
        closeDialog();
        try {
            await deleteNews(id);
            setDialog({ isOpen: true, title: '成功', message: '新闻删除成功!', isConfirm: false });
            fetchNews();
        } catch (error) {
            let errorMessage = '删除失败，请确认您已登录。';
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                errorMessage = '权限不足。无法删除。';
            }
            setDialog({ isOpen: true, title: '错误', message: errorMessage, isConfirm: false });
            console.error("Delete failed:", error);
        }
    }

    const handleDelete = (id: number) => {
        setDialog({
            isOpen: true,
            title: '确认删除',
            message: '确定要删除这条新闻吗?',
            isConfirm: true,
            onConfirm: () => confirmDelete(id),
        });
    };

    // 模态框渲染逻辑
    const renderDialog = () => {
        if (!dialog.isOpen) return null;

        const isError = dialog.title === '错误';

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header">
                        <div style={{ color: isError ? '#ef4444' : '#10b981' }}>
                            {/* Simplification: using simple text or emojis for icons to reduce SVG bloat in this view, styling via CSS */}
                            {isError ? '⚠️' : '✅'}
                        </div>
                        <h4 className="modal-title">{dialog.title}</h4>
                    </div>
                    <p>{dialog.message}</p>

                    <div className="modal-footer">
                        {dialog.isConfirm && (
                            <button
                                onClick={closeDialog}
                                className="btn-secondary"
                                style={{ padding: '0.5rem 1rem' }}
                            >
                                取消
                            </button>
                        )}
                        <button
                            onClick={dialog.isConfirm ? dialog.onConfirm : closeDialog}
                            style={{
                                backgroundColor: dialog.isConfirm ? '#ef4444' : 'var(--primary-color)',
                                padding: '0.5rem 1rem'
                            }}
                        >
                            {dialog.isConfirm ? '确认删除' : '确定'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="flex-center" style={{ height: '50vh' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>加载中...</div>
        </div>
    );

    return (
        <div className="manage-container card">
            {renderDialog()}
            <h2 className="page-title">新闻管理</h2>

            <form onSubmit={handleSave} className="news-form">
                <h3 className="form-title">{editingId !== null ? '编辑新闻' : '发布新新闻'}</h3>

                <div>
                    <label>标题</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleInputChange}
                        required
                        placeholder="请输入新闻标题"
                    />
                </div>

                <div>
                    <label>作者</label>
                    <input
                        name="author"
                        value={form.author}
                        onChange={handleInputChange}
                        required
                        placeholder="作者姓名 (自动填充)"
                        disabled // Disabled as author is set by backend usually, but form allows editing? Logic said backend sets author. I will keep it editable if user wants but backend overwrites or user can impersonate? The code says backend sets it from token. So input might be ignored or redundant. I'll keep it as is from original but maybe disabled or readOnly if possible? The original code had it required. I'll keep it required for now matching original logic if backend uses it. Wait, backend instructions said "createNews... automatically set author". So this field is ignored? I'll keep it for now to avoid breaking constraints if DTO needs it.
                    />
                </div>

                <div>
                    <label>内容</label>
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        placeholder="请输入新闻内容..."
                    />
                </div>

                <div className="form-actions">
                    <button type="submit">
                        {editingId !== null ? '保存更改' : '发布'}
                    </button>
                    {editingId !== null && (
                        <button
                            type="button"
                            onClick={() => { setEditingId(null); setForm(emptyForm); }}
                            className="btn-secondary"
                        >
                            取消编辑
                        </button>
                    )}
                </div>
            </form>

            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>已发布新闻列表</h3>
            <div className="manage-list">
                {news.map((item) => (
                    <div key={item.id} className="manage-item">
                        <div className="item-info">
                            <strong>{item.title}</strong>
                            <p>作者: {item.author} | ID: {item.id}</p>
                        </div>
                        <div className="item-actions">
                            <button
                                onClick={() => handleEdit(item)}
                                className="btn-edit"
                            >
                                编辑
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="btn-delete"
                            >
                                删除
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageNewsPage;