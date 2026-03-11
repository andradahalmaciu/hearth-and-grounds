import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getReservations, getContactMessages, getMenuAll } from '../../services/api'

// ── Shared Sidebar ──────────────────────────────────────────────────────────

export function AdminSidebar() {
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  const navItem = (to, label) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block font-sans text-xs tracking-widest uppercase py-2.5 px-4 transition-colors ${
          isActive
            ? 'bg-parchment/10 text-parchment'
            : 'text-parchment/40 hover:text-parchment/70 hover:bg-parchment/5'
        }`
      }
    >
      {label}
    </NavLink>
  )

  return (
    <aside className="fixed top-0 left-0 h-screen w-56 bg-espresso flex flex-col z-40 border-r border-parchment/5">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-parchment/10">
        <p className="font-serif text-parchment text-xl tracking-tight">H&amp;G</p>
        <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-parchment/30 mt-0.5">
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 space-y-0.5">
        {navItem('/admin/dashboard', 'Dashboard')}
        {navItem('/admin/menu', 'Menu Items')}
        {navItem('/admin/reservations', 'Reservations')}
        {navItem('/admin/messages', 'Messages')}
      </nav>

      {/* User + Logout */}
      <div className="px-4 py-6 border-t border-parchment/10">
        {username && (
          <p className="font-sans text-[10px] tracking-wide text-parchment/30 px-4 mb-3 truncate">
            {username}
          </p>
        )}
        <button
          onClick={handleLogout}
          className="block w-full text-left font-sans text-xs tracking-widest uppercase py-2.5 px-4 text-parchment/30 hover:text-parchment/60 transition-colors"
        >
          Log Out
        </button>
      </div>
    </aside>
  )
}

// ── Dashboard ───────────────────────────────────────────────────────────────

function StatCard({ label, value, loading }) {
  return (
    <div className="bg-white/60 border border-walnut/10 p-8">
      <p className="font-sans text-[10px] tracking-widest uppercase text-walnut/40 mb-3">{label}</p>
      {loading ? (
        <div className="h-9 w-12 bg-walnut/10 animate-pulse" />
      ) : (
        <p className="font-serif text-espresso text-4xl">{value ?? '—'}</p>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const { username } = useAuth()
  const [stats, setStats] = useState({ todayCount: null, unreadCount: null, menuCount: null })
  const [loading, setLoading] = useState(true)

  const todayStr = new Date().toISOString().split('T')[0]

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [reservations, messages, menuItems] = await Promise.all([
          getReservations(todayStr),
          getContactMessages(),
          getMenuAll(),
        ])
        if (cancelled) return
        const todayCount = Array.isArray(reservations) ? reservations.length : 0
        const unreadCount = Array.isArray(messages)
          ? messages.filter((m) => !m.read_at && !m.read).length
          : 0
        const menuCount = Array.isArray(menuItems) ? menuItems.length : 0
        setStats({ todayCount, unreadCount, menuCount })
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [todayStr])

  return (
    <div className="flex min-h-screen bg-parchment">
      <AdminSidebar />

      {/* Main */}
      <main className="ml-56 flex-1 px-10 py-12">
        <div className="max-w-3xl">
          <p className="font-sans text-clay text-xs tracking-widest uppercase mb-2">Overview</p>
          <h1 className="font-serif text-espresso text-4xl mb-10 leading-tight">
            {greeting}{username ? `, ${username}` : ''}.
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard label="Today's Reservations" value={stats.todayCount} loading={loading} />
            <StatCard label="Unread Messages" value={stats.unreadCount} loading={loading} />
            <StatCard label="Menu Items" value={stats.menuCount} loading={loading} />
          </div>

          <div className="mt-12 pt-8 border-t border-walnut/10">
            <p className="font-sans text-xs text-walnut/30 tracking-wide">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
