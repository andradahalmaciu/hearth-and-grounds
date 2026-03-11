import { useState } from 'react'
import { createReservation } from '../services/api'

const today = new Date().toISOString().split('T')[0]

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
]

export default function Reserve() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    party_size: '2',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        date: form.date,
        time: form.time,
        party_size: parseInt(form.party_size, 10),
        notes: form.notes || undefined,
      }
      await createReservation(payload)
      setConfirmation(payload)
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="pt-16 min-h-screen bg-parchment">

      {/* Header */}
      <div className="relative bg-espresso py-24 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #f9f4ec 1px, transparent 1px)', backgroundSize: '26px 26px' }}
        />
        <div className="relative">
          <p className="font-sans text-clay text-xs tracking-widest uppercase mb-3">Book a Seat</p>
          <h1 className="font-serif text-parchment text-5xl md:text-6xl mb-4">Reserve a Table</h1>
          <p className="font-sans text-parchment/40 text-sm max-w-sm mx-auto leading-relaxed">
            We keep a few tables for walk-ins too — but booking ahead means we're ready for you.
          </p>
        </div>
      </div>

      {/* Form section */}
      <section className="py-20 px-6 bg-parchment">
        <div className="max-w-xl mx-auto">

          {confirmation ? (
            <div className="bg-sage-light p-10">
              <p className="font-sans text-clay text-xs tracking-widest uppercase mb-4">Booking Confirmed</p>
              <p className="font-serif text-espresso text-3xl mb-4 leading-tight">See you then.</p>
              <p className="font-sans text-walnut/70 text-sm leading-relaxed">
                We've saved your table for <span className="text-espresso font-medium">{confirmation.name}</span> on{' '}
                <span className="text-espresso font-medium">{confirmation.date}</span> at{' '}
                <span className="text-espresso font-medium">{confirmation.time}</span> for{' '}
                <span className="text-espresso font-medium">{confirmation.party_size}</span>{' '}
                {confirmation.party_size === 1 ? 'guest' : 'guests'}. A confirmation will be sent to {confirmation.email}.
              </p>
              <button
                onClick={() => {
                  setConfirmation(null)
                  setForm({ name: '', email: '', phone: '', date: '', time: '', party_size: '2', notes: '' })
                }}
                className="mt-8 font-sans text-xs tracking-widest uppercase text-walnut/50 hover:text-clay transition-colors"
              >
                Make another reservation
              </button>
            </div>
          ) : (
            <>
              <p className="font-sans text-clay text-xs tracking-widest uppercase mb-6">Your Details</p>
              <h2 className="font-serif text-espresso text-4xl mb-10 leading-tight">
                Book your<br />table
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Name */}
                <div>
                  <label className="font-sans text-xs tracking-widest uppercase text-walnut/35 block mb-2">
                    Full Name <span className="text-clay">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Your name"
                    className="w-full bg-transparent border-b border-walnut/20 py-2.5 font-sans text-sm text-espresso placeholder-walnut/25 focus:outline-none focus:border-clay transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="font-sans text-xs tracking-widest uppercase text-walnut/35 block mb-2">
                    Email <span className="text-clay">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={set('email')}
                    placeholder="email@example.com"
                    className="w-full bg-transparent border-b border-walnut/20 py-2.5 font-sans text-sm text-espresso placeholder-walnut/25 focus:outline-none focus:border-clay transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="font-sans text-xs tracking-widest uppercase text-walnut/35 block mb-2">
                    Phone <span className="text-walnut/25">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder="+34 600 000 000"
                    className="w-full bg-transparent border-b border-walnut/20 py-2.5 font-sans text-sm text-espresso placeholder-walnut/25 focus:outline-none focus:border-clay transition-colors"
                  />
                </div>

                {/* Date + Time */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="font-sans text-xs tracking-widest uppercase text-walnut/35 block mb-2">
                      Date <span className="text-clay">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={today}
                      value={form.date}
                      onChange={set('date')}
                      className="w-full bg-transparent border-b border-walnut/20 py-2.5 font-sans text-sm text-espresso focus:outline-none focus:border-clay transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs tracking-widest uppercase text-walnut/35 block mb-2">
                      Time <span className="text-clay">*</span>
                    </label>
                    <select
                      required
                      value={form.time}
                      onChange={set('time')}
                      className="w-full bg-transparent border-b border-walnut/20 py-2.5 font-sans text-sm text-espresso focus:outline-none focus:border-clay transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select time</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Party size */}
                <div>
                  <label className="font-sans text-xs tracking-widest uppercase text-walnut/35 block mb-2">
                    Party Size <span className="text-clay">*</span>
                  </label>
                  <select
                    required
                    value={form.party_size}
                    onChange={set('party_size')}
                    className="w-full bg-transparent border-b border-walnut/20 py-2.5 font-sans text-sm text-espresso focus:outline-none focus:border-clay transition-colors appearance-none cursor-pointer"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="font-sans text-xs tracking-widest uppercase text-walnut/35 block mb-2">
                    Special Requests <span className="text-walnut/25">(optional)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={set('notes')}
                    placeholder="Allergies, accessibility needs, a birthday surprise…"
                    className="w-full bg-transparent border-b border-walnut/20 py-2.5 font-sans text-sm text-espresso placeholder-walnut/25 focus:outline-none focus:border-clay transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p className="font-sans text-sm text-dusty">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-clay text-parchment font-sans text-xs tracking-widest uppercase px-8 py-3.5 hover:bg-walnut transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Reserving…' : 'Reserve My Table'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
