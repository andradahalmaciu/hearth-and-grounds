import { useState } from 'react'
import { sendContactMessage } from '../services/api'

// All 18 Pinterest board images
const p = id => `https://i.pinimg.com/originals/${id.slice(0,2)}/${id.slice(2,4)}/${id.slice(4,6)}/${id}.jpg`

const gallery = [
  { id: 'e398a0bcafc910b6e5c0870643dba010', caption: 'The chalkboard, daily',          span: '' },
  { id: 'bb2ec3f653d719d8192b2535375c15bf', caption: '"Life is always better with coffee"', span: 'md:row-span-2' },
  { id: '178a439cdc71e178fe61914017699532', caption: 'Kiosk in bloom',                  span: '' },
  { id: 'a11e0560c5df040035bd4d93100d2591', caption: 'The bar, morning light',           span: '' },
  { id: 'be263c6e374e430f49e9b98dfac061d8', caption: 'Green shutters, old city',        span: 'md:col-span-2' },
  { id: '503225d527ce59204f525fff5c2818c0', caption: 'Colour and warmth inside',        span: '' },
  { id: 'bfdaf8ee4cd79c246b35f5e7aa3133b2', caption: 'The kettle always sings',         span: '' },
  { id: 'd1d5b81d57b31f9c5290749b4868d7d6', caption: 'Caffeine, even for the plants',  span: '' },
  { id: '0b7b1a6d9f44fbbb88954133993cccb1', caption: 'A corner of calm',               span: '' },
  { id: '1673381c3e8c6ef09fc42292c9c92a42', caption: 'Quiet afternoon',                span: 'md:row-span-2' },
  { id: '3b4d3cf4c919ae6659644ecdc0a759cd', caption: 'Hand-thrown — the poppy dish',   span: '' },
  { id: '6958d1a5f46e5c658f0c335ced87e933', caption: 'Rain, candles, and a good cup',  span: '' },
  { id: '9424072e79cf3430af770664e7694a66', caption: 'Seasonal colours',               span: '' },
  { id: '6e407210b35e36609e5cd5c4df9febf2', caption: 'Out in the open',                span: '' },
  { id: 'a53eecd9ce3c64254140caa160f6b283', caption: 'Stone walls, flowers, stories',  span: 'md:col-span-2' },
  { id: '467f7c0cc2aedea26d2b0ec45c624d1f', caption: 'The blue door',                  span: '' },
  { id: '6b7ef280b2db73a9192a94f8b1d3bc73', caption: 'Green vintage — the dream exterior', span: '' },
  { id: '390d24dae384df29a9629f4fed0ddd83', caption: 'Yellow house, golden afternoon', span: '' },
]

export default function GalleryContact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await sendContactMessage(form)
      setSent(true)
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="pt-16 min-h-screen bg-parchment">

      {/* ── Header ── */}
      <div className="relative bg-espresso py-24 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #f9f4ec 1px, transparent 1px)', backgroundSize: '26px 26px' }}
        />
        <div className="relative">
          <p className="font-sans text-clay text-xs tracking-widest uppercase mb-3">Gallery &amp; Contact</p>
          <h1 className="font-serif text-parchment text-5xl md:text-6xl mb-4">A glimpse inside.</h1>
          <p className="font-sans text-parchment/40 text-sm max-w-xs mx-auto">
            The best way to know Hearth &amp; Grounds is to come in. But this is a start.
          </p>
        </div>
      </div>

      {/* ── Gallery — all 18 Pinterest images ── */}
      <section className="py-16 px-6 bg-linen">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 auto-rows-[200px] gap-2">
          {gallery.map((img) => (
            <div
              key={img.id}
              className={`overflow-hidden group relative ${img.span}`}
            >
              <img
                src={p(img.id)}
                alt={img.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/45 transition-colors duration-300 flex items-end">
                <span className="font-sans text-xs text-parchment px-4 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-wide">
                  {img.caption}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact + Form ── */}
      <section className="py-20 px-6 bg-parchment">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">

          {/* Contact info */}
          <div>
            <p className="font-sans text-clay text-xs tracking-widest uppercase mb-6">Visit Us</p>
            <h2 className="font-serif text-espresso text-4xl mb-10 leading-tight">
              Find Hearth<br />&amp; Grounds
            </h2>
            <div className="space-y-8 font-sans text-sm text-walnut/65">
              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-walnut/35 mb-2">Address</p>
                <p className="leading-relaxed">
                  Carrer de la Mar, 12<br />
                  Can Picafort, Mallorca<br />
                  07458 — a short walk from the beach
                </p>
              </div>
              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-walnut/35 mb-2">Opening Hours</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between max-w-xs"><span>Monday – Friday</span><span>7:00 – 20:00</span></div>
                  <div className="flex justify-between max-w-xs"><span>Saturday</span><span>8:00 – 21:00</span></div>
                  <div className="flex justify-between max-w-xs"><span>Sunday</span><span>9:00 – 18:00</span></div>
                </div>
              </div>
              <div>
                <p className="font-sans text-xs tracking-widest uppercase text-walnut/35 mb-2">Contact</p>
                <p>hello@hearthandgrounds.com</p>
                <p className="mt-1">+34 971 000 111</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <p className="font-sans text-clay text-xs tracking-widest uppercase mb-6">Say Hello</p>
            <h2 className="font-serif text-espresso text-4xl mb-10 leading-tight">
              Send us<br />a message
            </h2>
            {sent ? (
              <div className="bg-sage-light p-8">
                <p className="font-serif text-espresso text-xl mb-2">Message received.</p>
                <p className="font-sans text-walnut/60 text-sm leading-relaxed">
                  We'll get back to you within a day. In the meantime, come in and say hello in person —
                  we'll have a cup ready.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <label className="font-sans text-xs tracking-widest uppercase text-walnut/35 block mb-2">Your Name</label>
                  <input type="text" required value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-transparent border-b border-walnut/20 py-2.5 font-sans text-sm text-espresso placeholder-walnut/25 focus:outline-none focus:border-clay transition-colors"
                    placeholder="Your name" />
                </div>
                <div>
                  <label className="font-sans text-xs tracking-widest uppercase text-walnut/35 block mb-2">Email</label>
                  <input type="email" required value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-transparent border-b border-walnut/20 py-2.5 font-sans text-sm text-espresso placeholder-walnut/25 focus:outline-none focus:border-clay transition-colors"
                    placeholder="email@example.com" />
                </div>
                <div>
                  <label className="font-sans text-xs tracking-widest uppercase text-walnut/35 block mb-2">Message</label>
                  <textarea required rows={5} value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-transparent border-b border-walnut/20 py-2.5 font-sans text-sm text-espresso placeholder-walnut/25 focus:outline-none focus:border-clay transition-colors resize-none"
                    placeholder="Tell us what's on your mind..." />
                </div>
                {error && (
                  <p className="font-sans text-sm text-dusty">{error}</p>
                )}
                <button type="submit" disabled={submitting}
                  className="bg-espresso text-parchment font-sans text-xs tracking-widest uppercase px-8 py-3.5 hover:bg-walnut transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
