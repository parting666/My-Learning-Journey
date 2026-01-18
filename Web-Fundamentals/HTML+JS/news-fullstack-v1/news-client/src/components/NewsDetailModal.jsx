import React from 'react'

export default function NewsDetailModal({ item, onClose }){
  if (!item) return null
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="absolute right-4 top-3 text-gray-500" onClick={onClose}>✖</button>
        <h2 className="text-xl font-bold mb-2">{item.title}</h2>
        <div className="text-sm text-gray-600 mb-3">
          作者: {item.author} | 分类: {item.category || '未分类'} | {new Date(item.created_at).toLocaleString()}
        </div>
        <div className="whitespace-pre-wrap leading-7">{item.content}</div>
      </div>
    </div>
  )
}
