import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(true) // 首次显示登录弹窗

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (saved) {
      setUser(JSON.parse(saved))
      setShowAuth(false)
    }
  }, [])

  const login = (u) => {
    setUser(u)
    localStorage.setItem('user', JSON.stringify(u))
    setShowAuth(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    setShowAuth(true)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, showAuth, setShowAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
