import React, { useState } from 'react'
import API from '../api'

export default function NewsFormModal({ initial, onClose, onSaved }){
  const [title,setTitle]=useState(initial?.title||'')
  const [content,setContent]=useState(initial?.content||'')
  const [author,setAuthor]=useState(initial?.author||'')
  const [category,setCategory]=useState(initial?.category||'')
  const [status,setStatus]=useState(initial?.status||'draft')

  const submit = async (e)=>{
    e.preventDefault()
    const payload = { title, content, author, category, status }
    if (initial?.id){
      await API.put(`/news/${initial.id}`, payload)
    } else {
      await API.post('/news', payload)
    }
    onSaved()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="absolute right-4 top-3 text-gray-500" onClick={onClose}>✖</button>
        <h3 className="text-lg font-semibold mb-3">{initial?.id?'编辑新闻':'添加新闻'}</h3>
        <form onSubmit={submit} className="space-y-3">
          <input className="input" placeholder="标题 *" value={title} onChange={e=>setTitle(e.target.value)} required />
          <textarea className="textarea" placeholder="内容 *" value={content} onChange={e=>setContent(e.target.value)} required />
          <input className="input" placeholder="作者 *" value={author} onChange={e=>setAuthor(e.target.value)} required />
          <select className="select" value={category} onChange={e=>setCategory(e.target.value)} required>
            <option value="">请选择分类</option>
            {['政治','经济','科技','文化','体育','娱乐'].map(c=>(<option key={c} value={c}>{c}</option>))}
          </select>
          <select className="select" value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
          </select>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>取消</button>
            <button className="btn btn-primary">保存</button>
          </div>
        </form>
      </div>
    </div>
  )
}
