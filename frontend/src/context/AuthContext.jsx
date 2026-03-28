import { createContext, useContext, useState, useCallback } from 'react'
import { login as apiLogin } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('hg_token'))
  const [username, setUsername] = useState(() => localStorage.getItem('hg_user'))

  const login = useCallback(async (user, pass) => {
    const data = await apiLogin(user, pass)
    localStorage.setItem('hg_token', data.token)
    localStorage.setItem('hg_user', data.username)
    setToken(data.token)
    setUsername(data.username)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('hg_token')
    localStorage.removeItem('hg_user')
    setToken(null)
    setUsername(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
