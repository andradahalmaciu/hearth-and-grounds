import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-espresso flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-parchment px-10 py-12">

          {/* Badge */}
          <div className="text-center mb-10">
            <div className="inline-flex flex-col items-center gap-1">
              <span className="font-serif text-espresso text-2xl tracking-tight">H&amp;G</span>
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-walnut/40">Admin</span>
            </div>
          </div>

          <p className="font-serif text-espresso text-2xl mb-8 text-center leading-snug">
            Welcome back
          </p>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label className="font-sans text-[10px] tracking-widest uppercase text-walnut/40 block mb-2">
                Username
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border-b border-walnut/20 py-2.5 font-sans text-sm text-espresso placeholder-walnut/25 focus:outline-none focus:border-clay transition-colors"
                placeholder="your username"
              />
            </div>

            <div>
              <label className="font-sans text-[10px] tracking-widest uppercase text-walnut/40 block mb-2">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-walnut/20 py-2.5 font-sans text-sm text-espresso placeholder-walnut/25 focus:outline-none focus:border-clay transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="font-sans text-xs text-dusty leading-relaxed">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-espresso text-parchment font-sans text-xs tracking-widest uppercase py-3.5 hover:bg-walnut-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center font-sans text-[10px] text-parchment/20 mt-6 tracking-wide">
          Hearth &amp; Grounds — Staff Only
        </p>
      </div>
    </div>
  )
}
