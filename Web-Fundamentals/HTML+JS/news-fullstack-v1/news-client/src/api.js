import axios from 'axios'
const API = axios.create({ baseURL: 'http://localhost:5001/api' })
API.interceptors.request.use((config) => {
  const saved = localStorage.getItem('user')
  if (saved) {
    const { token } = JSON.parse(saved)
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
export default API
