import React, { useEffect, useState } from 'react'
import API from './api'
import { useAuth } from './state/AuthContext.jsx'
import AuthModal from './components/AuthModal.jsx'
import Filters from './components/Filters.jsx'
import NewsCard from './components/NewsCard.jsx'
import NewsFormModal from './components/NewsFormModal.jsx'
import NewsDetailModal from './components/NewsDetailModal.jsx'

export default function App(){
  const { user, logout, showAuth, setShowAuth } = useAuth()
  const [items,setItems]=useState([])
  const [loading,setLoading]=useState(false)
  const [category,setCategory]=useState('全部')
  const [search,setSearch]=useState('')
  const [showForm,setShowForm]=useState(false)
  const [editing,setEditing]=useState(null)
  const [detail,setDetail]=useState(null)

  const load = async ()=>{
    setLoading(true)
    const params = {}
    if (category && category!=='全部') params.category = category
    if (search) params.search = search
    const { data } = await API.get('/news', { params })
    setItems(data)
    setLoading(false)
  }

  useEffect(()=>{ load() }, [])

  const doSearch = ()=> load()

  const addNews = ()=>{
    if (!user) return setShowAuth(true)
    setEditing(null); setShowForm(true)
  }

  const editNews = (n)=>{
    if (!user) return setShowAuth(true)
    setEditing(n); setShowForm(true)
  }

  const delNews = async (n)=>{
    if (!user) return setShowAuth(true)
    if (!confirm('确定删除这条新闻吗？')) return
    await API.delete(`/news/${n.id}`)
    load()
  }

  const viewNews = async (n)=>{
    const { data } = await API.get(`/news/${n.id}`)
    setDetail(data)
  }

  return (
    <div className="container-lg py-6">
      <header className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-blue-700">📰 新闻管理系统</div>
        <div className="flex items-center gap-3">
          {user ? <>
            <span className="text-sm text-gray-600">你好，{user.username}</span>
            <button className="btn btn-secondary" onClick={logout}>退出</button>
          </> : <button className="btn btn-primary" onClick={()=>setShowAuth(true)}>登录/注册</button>}
          <button className="btn btn-primary" onClick={addNews}>添加新闻</button>
        </div>
      </header>

      <Filters category={category} setCategory={setCategory} search={search} setSearch={setSearch} onSearch={doSearch} />

      {loading ? <div>加载中...</div> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(n => (
            <NewsCard key={n.id} item={n} onView={viewNews} onEdit={editNews} onDelete={delNews} />
          ))}
        </div>
      )}

      {showAuth && <AuthModal />}
      {showForm && <NewsFormModal initial={editing} onClose={()=>setShowForm(false)} onSaved={()=>{ setShowForm(false); load() }} />}
      {detail && <NewsDetailModal item={detail} onClose={()=>setDetail(null)} />}
    </div>
  )
}
