import React, { useState } from 'react'
import API from '../api'
import { useAuth } from '../state/AuthContext.jsx'

export default function AuthModal() {
  const { setShowAuth, login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (isLogin) {
        const res = await API.post('/login', { username, password })
        login({ username, token: res.data.token })
      } else {
        await API.post('/register', { username, password })
        alert('注册成功，请登录')
        setIsLogin(true)
      }
    } catch (err) {
      alert(err?.response?.data?.message || '操作失败')
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="absolute right-4 top-3 text-gray-500" onClick={()=>setShowAuth(false)}>✖</button>
        <h2 className="text-xl font-bold text-center mb-4">{isLogin ? '登录' : '注册'}</h2>
        <form onSubmit={submit} className="space-y-3">
          <input className="input" placeholder="用户名" value={username} onChange={e=>setUsername(e.target.value)} />
          <input className="input" type="password" placeholder="密码" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn btn-primary w-full">{isLogin ? '登录' : '注册'}</button>
        </form>
        <p className="text-center mt-3 text-blue-600 cursor-pointer" onClick={()=>setIsLogin(v=>!v)}>
          {isLogin ? '没有账号？去注册' : '已有账号？去登录'}
        </p>
      </div>
    </div>
  )
}
