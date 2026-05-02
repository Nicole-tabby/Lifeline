import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('ll_token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api.get('/auth/me')
        .then(r => setUser(r.data.user))
        .catch(() => localStorage.removeItem('ll_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('ll_token', data.token)
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser(data.user)
    return data.user
  }

  const register = async (name, email, password, role, university) => {
    const { data } = await api.post('/auth/register', { name, email, password, role, university })
    localStorage.setItem('ll_token', data.token)
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('ll_token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const updateUser = (updates) => setUser(u => ({ ...u, ...updates }))

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
