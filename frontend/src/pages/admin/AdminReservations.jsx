import { useEffect, useState } from 'react'
import { AdminSidebar } from './AdminDashboard'
import { getReservations, updateReservationStatus, exportReservationsCsv } from '../../services/api'

const todayStr = () => new Date().toISOString().split('T')[0]

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-sage-light text-sage-dark',
    cancelled: 'bg-dusty-light text-dusty',
  }
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : '—'
  return (
    <span className={`font-sans text-[10px] tracking-widest uppercase px-2.5 py-1 ${styles[status] || 'bg-walnut/10 text-walnut/40'}`}>
      {label}
    </span>
  )
}

export default function AdminReservations() {
  const [date, setDate] = useState(todayStr())
  const [showAll, setShowAll] = useState(false)
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  const load = async (filterDate) => {
    setLoading(true)
    setError('')
    try {
      const data = await getReservations(filterDate || undefined)
      setReservations(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Failed to load reservations.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(showAll ? undefined : date)
  }, [date, showAll])

  const handleStatus = async (id, status) => {
    setActionLoading(id + status)
    try {
      await updateReservationStatus(id, status)
      await load(showAll ? undefined : date)
    } catch (err) {
      alert(err?.message || 'Failed to update status.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleShowAll = () => {
    setShowAll(true)
  }

  const handleDateChange = (e) => {
    setDate(e.target.value)
    setShowAll(false)
  }

  const handleExport = async () => {
    try {
      await exportReservationsCsv(showAll ? undefined : date)
    } catch {
      alert('Export failed. Please try again.')
    }
  }

  return (
    <div className="flex min-h-screen bg-parchment">
      <AdminSidebar />

      <main className="ml-56 flex-1 px-10 py-12">
        <div className="max-w-5xl">

          {/* Header */}
          <div className="mb-10">
            <p className="font-sans text-clay text-xs tracking-widest uppercase mb-2">Manage</p>
            <h1 className="font-serif text-espresso text-4xl leading-tight">Reservations</h1>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-5 mb-8">
            <div>
              <label className="font-sans text-[10px] tracking-widest uppercase text-walnut/40 block mb-2">
                Filter by date
              </label>
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                className="bg-transparent border-b border-walnut/20 py-2 font-sans text-sm text-espresso focus:outline-none focus:border-clay transition-colors"
              />
            </div>
            <button
              onClick={handleShowAll}
              className={`self-end mb-0.5 font-sans text-xs tracking-widest uppercase py-2 px-4 border transition-colors ${
                showAll
                  ? 'border-espresso bg-espresso text-parchment'
                  : 'border-walnut/20 text-walnut/50 hover:border-walnut/40 hover:text-walnut'
              }`}
            >
              Show All
            </button>
            <button
              onClick={handleExport}
              className="self-end mb-0.5 font-sans text-xs tracking-widest uppercase py-2 px-4 border border-walnut/20 text-walnut/50 hover:border-walnut/40 hover:text-walnut transition-colors"
            >
              Export CSV
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="font-sans text-sm text-dusty mb-6">{error}</p>
          )}

          {/* Table */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-walnut/5 animate-pulse" />
              ))}
            </div>
          ) : reservations.length === 0 ? (
            <p className="font-sans text-sm text-walnut/40">
              {showAll ? 'No reservations found.' : `No reservations for ${date}.`}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-walnut/10">
                    <th className="font-sans text-[10px] tracking-widest uppercase text-walnut/35 pb-3 pr-5">Name</th>
                    <th className="font-sans text-[10px] tracking-widest uppercase text-walnut/35 pb-3 pr-5">Email</th>
                    <th className="font-sans text-[10px] tracking-widest uppercase text-walnut/35 pb-3 pr-5">Date</th>
                    <th className="font-sans text-[10px] tracking-widest uppercase text-walnut/35 pb-3 pr-5">Time</th>
                    <th className="font-sans text-[10px] tracking-widest uppercase text-walnut/35 pb-3 pr-5">Party</th>
                    <th className="font-sans text-[10px] tracking-widest uppercase text-walnut/35 pb-3 pr-5">Status</th>
                    <th className="font-sans text-[10px] tracking-widest uppercase text-walnut/35 pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id} className="border-b border-walnut/5 hover:bg-walnut/5 transition-colors">
                      <td className="font-sans text-sm text-espresso py-4 pr-5">{r.name}</td>
                      <td className="font-sans text-xs text-walnut/60 py-4 pr-5">{r.email}</td>
                      <td className="font-sans text-xs text-walnut/60 py-4 pr-5">{r.date}</td>
                      <td className="font-sans text-xs text-walnut/60 py-4 pr-5">{r.time}</td>
                      <td className="font-sans text-xs text-walnut/60 py-4 pr-5">{r.party_size}</td>
                      <td className="py-4 pr-5">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="py-4">
                        <div className="flex gap-3">
                          {r.status !== 'confirmed' && r.status !== 'cancelled' && (
                            <button
                              onClick={() => handleStatus(r.id, 'confirmed')}
                              disabled={actionLoading === r.id + 'confirmed'}
                              className="font-sans text-xs text-sage-dark hover:text-espresso transition-colors disabled:opacity-40"
                            >
                              Confirm
                            </button>
                          )}
                          {r.status === 'pending' && (
                            <button
                              onClick={() => handleStatus(r.id, 'cancelled')}
                              disabled={actionLoading === r.id + 'cancelled'}
                              className="font-sans text-xs text-dusty/60 hover:text-dusty transition-colors disabled:opacity-40"
                            >
                              Cancel
                            </button>
                          )}
                          {r.status === 'confirmed' && (
                            <button
                              onClick={() => handleStatus(r.id, 'cancelled')}
                              disabled={actionLoading === r.id + 'cancelled'}
                              className="font-sans text-xs text-dusty/60 hover:text-dusty transition-colors disabled:opacity-40"
                            >
                              Cancel
                            </button>
                          )}
                          {r.status === 'cancelled' && (
                            <button
                              onClick={() => handleStatus(r.id, 'confirmed')}
                              disabled={actionLoading === r.id + 'confirmed'}
                              className="font-sans text-xs text-sage-dark hover:text-espresso transition-colors disabled:opacity-40"
                            >
                              Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
