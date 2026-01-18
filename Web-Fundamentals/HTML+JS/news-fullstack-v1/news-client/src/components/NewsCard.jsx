import React from 'react'

export default function NewsCard({ item, onView, onEdit, onDelete }){
  return (
    <div className="card p-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>{new Date(item.created_at).toLocaleString()}</span>
        <span className={`badge ${item.status==='published'?'badge-green':'badge-amber'}`}>
          {item.status==='published'?'已发布':'草稿'}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-1 line-clamp-2">{item.title}</h3>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>作者: {item.author}</span>
        <span>分类: {item.category || '未分类'}</span>
      </div>
      <p className="text-gray-700 line-clamp-3 mb-3">{item.content}</p>
      <div className="flex justify-end gap-2">
        <button className="btn btn-secondary" onClick={()=>onView(item)}>查看</button>
        <button className="btn btn-primary" onClick={()=>onEdit(item)}>编辑</button>
        <button className="btn btn-danger" onClick={()=>onDelete(item)}>删除</button>
      </div>
    </div>
  )
}
