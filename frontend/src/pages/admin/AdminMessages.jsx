import { useEffect, useState } from 'react'
import { AdminSidebar } from './AdminDashboard'
import { getContactMessages, markMessageRead } from '../../services/api'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [marking, setMarking] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getContactMessages()
      setMessages(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Failed to load messages.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleMarkRead = async (id) => {
    setMarking(id)
    try {
      await markMessageRead(id)
      await load()
    } catch (err) {
      alert(err?.message || 'Failed to mark as read.')
    } finally {
      setMarking(null)
    }
  }

  const isUnread = (msg) => !msg.read_at && !msg.read

  const unreadCount = messages.filter(isUnread).length

  return (
    <div className="flex min-h-screen bg-parchment">
      <AdminSidebar />

      <main className="ml-56 flex-1 px-10 py-12">
        <div className="max-w-3xl">

          {/* Header */}
          <div className="mb-10">
            <p className="font-sans text-clay text-xs tracking-widest uppercase mb-2">Inbox</p>
            <div className="flex items-center gap-4">
              <h1 className="font-serif text-espresso text-4xl leading-tight">Messages</h1>
              {unreadCount > 0 && (
                <span className="bg-clay text-parchment font-sans text-[10px] tracking-widest uppercase px-2.5 py-1">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="font-sans text-sm text-dusty mb-6">{error}</p>
          )}

          {/* List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-walnut/5 animate-pulse" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <p className="font-sans text-sm text-walnut/40">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => {
                const unread = isUnread(msg)
                return (
                  <div
                    key={msg.id}
                    className={`border-l-2 p-6 transition-colors ${
                      unread
                        ? 'border-clay bg-sage-light/40'
                        : 'border-walnut/10 bg-white/40'
                    }`}
                  >
                    {/* Meta row */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="font-sans text-sm text-espresso font-medium">{msg.name}</p>
                        <p className="font-sans text-xs text-walnut/50 mt-0.5">{msg.email}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-sans text-xs text-walnut/35">
                          {formatDate(msg.created_at || msg.date)}
                        </p>
                        {unread && (
                          <span className="font-sans text-[9px] tracking-widest uppercase text-clay mt-1 block">
                            Unread
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Message body */}
                    <p className="font-sans text-sm text-walnut/70 leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>

                    {/* Mark as read */}
                    {unread && (
                      <div className="mt-4">
                        <button
                          onClick={() => handleMarkRead(msg.id)}
                          disabled={marking === msg.id}
                          className="font-sans text-xs tracking-widest uppercase text-sage-dark hover:text-espresso transition-colors disabled:opacity-40"
                        >
                          {marking === msg.id ? 'Marking…' : 'Mark as Read'}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
