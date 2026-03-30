import { useState, useEffect } from 'react'
import { getMenu } from '../services/api'

const menu = {
  espresso: {
    label: 'Espresso',
    emoji: '☕',
    items: [
      { name: 'Ristretto',                  desc: '1:1 ratio — equal parts coffee and water. Short, sweet, and intensely concentrated.', price: '€3.00' },
      { name: 'Espresso',                  desc: '1:2 ratio — single origin, dialled in daily by our baristas.',                  price: '€3.00' },
      { name: 'Double Espresso',            desc: 'More of a good thing.',                                                         price: '€3.50' },
      { name: 'Cortado',                    desc: 'Equal parts espresso and warm milk. Balanced, clean.',                          price: '€3.80' },
      { name: 'Flat White',                 desc: '18g espresso, velvety micro-foam. A proper daily ritual.',                      price: '€4.50' },
      { name: 'Cappuccino',                 desc: 'Classic foam dome — dry or wet, your call.',                                    price: '€4.50' },
      { name: 'Latte',                      desc: 'Smooth and milky. Ask about our house syrups.',                                 price: '€4.80' },
      { name: 'Oat Latte',                  desc: 'Barista oat milk — a daily staple for many of our regulars.',                   price: '€5.20' },
      { name: 'Honey Walnut Latte ✦',       desc: 'Our signature. House honey syrup, toasted walnut, oat milk.',                   price: '€5.80' },
      { name: 'Rose Cardamom Latte ✦',      desc: 'Fragrant and floral. Rose water, cardamom, steamed milk.',                      price: '€5.80' },
    ],
    note: {
      title: 'Milk Alternatives',
      body: 'Oat, almond, soy, or coconut milk available for any drink. Add €0.50 for a non-dairy alternative.',
      bg: 'bg-sage-light',
    },
  },
  filter: {
    label: 'Filter Coffee',
    emoji: '🫗',
    items: [
      { name: 'Pour Over',    desc: 'Rotating single origins from our roastery. Ask what\'s on today.',              price: '€5.50' },
      { name: 'AeroPress',    desc: 'Full immersion, clean cup. Our preferred morning method.',                       price: '€4.80' },
      { name: 'Cold Brew',    desc: '20-hour cold steep. Rich, smooth, and completely bitterness-free.',              price: '€5.00' },
      { name: 'Batch Brew',   desc: 'Freshly brewed filter on tap. Our most approachable cup.',                       price: '€3.50' },
    ],
  },
  roastery: {
    label: 'Roastery',
    emoji: '🌿',
    items: [
      { name: 'Ethiopian Yirgacheffe', desc: 'Washed. Blueberry, jasmine, lemon verbena. Light roast. 250g bag.',           price: '€14.00' },
      { name: 'Colombian Huila',       desc: 'Natural. Brown sugar, dried apricot, milk chocolate. Medium. 250g.',          price: '€13.00' },
      { name: 'Guatemalan Antigua',    desc: 'Honey processed. Hazelnut, peach, golden syrup. Medium-dark. 250g.',          price: '€12.50' },
      { name: 'Seasonal Blend',        desc: 'Ask us what\'s in this month\'s blend. Always a crowd favourite. 250g.',      price: '€11.50' },
    ],
    note: {
      title: 'About Our Roasts',
      body: 'All beans are roasted in small batches on our in-house drum roaster. Origins rotate seasonally based on harvest. Ask your barista for tasting notes and brewing advice.',
      bg: 'bg-clay-light',
    },
  },
  food: {
    label: 'Food',
    emoji: '🥐',
    items: [
      { name: 'Cardamom Croissant',           desc: 'Freshly baked, laminated dough, fragrant cardamom sugar filling.',         price: '€4.50' },
      { name: 'Almond & Orange Blossom Tart', desc: 'Buttery shell, frangipane, a hint of orange blossom water.',               price: '€5.00' },
      { name: 'Sourdough Toast',              desc: 'Local sourdough, cultured butter, seasonal jam. Add avocado €2.',          price: '€4.80' },
      { name: 'Grain Bowl',                   desc: 'Farro, roasted seasonal vegetables, tahini dressing. Hearty and good.',    price: '€11.00' },
      { name: 'Cheese & Honey Toast',         desc: 'Whipped ricotta, local honey, toasted walnuts on sourdough.',              price: '€6.50' },
    ],
  },
  pottery: {
    label: 'Art & Pottery',
    emoji: '🏺',
    items: [
      { name: 'Hand-Thrown Mugs',         desc: 'By local ceramicists. Every piece is unique. Ask about the current makers.',  price: 'From €28' },
      { name: 'Ceramic Pour Over Drippers', desc: 'Functional art. Use it daily, or give it as a gift.',                       price: 'From €45' },
      { name: 'Framed Prints',            desc: 'Rotating gallery. Originals and limited prints from local artists.',           price: 'From €60' },
      { name: 'Handmade Candles',         desc: 'Scented with coffee, cedarwood, and vanilla. Made by local artisans.',        price: 'From €18' },
    ],
    note: {
      title: 'Gallery Openings',
      body: 'We host a gallery opening on the first Friday of every month. Come meet the makers, hear the stories, and take something beautiful home.',
      bg: 'bg-dusty-light',
    },
  },
}

// Category display metadata (labels/emoji/notes) keyed by category id
const categoryMeta = {
  espresso: { label: 'Espresso', emoji: '☕', note: { title: 'Milk Alternatives', body: 'Oat, almond, soy, or coconut milk available for any drink. Add €0.50 for a non-dairy alternative.', bg: 'bg-sage-light' } },
  filter:   { label: 'Filter Coffee', emoji: '🫗' },
  roastery: { label: 'Roastery', emoji: '🌿', note: { title: 'About Our Roasts', body: 'All beans are roasted in small batches on our in-house drum roaster. Origins rotate seasonally based on harvest.', bg: 'bg-clay-light' } },
  food:     { label: 'Food', emoji: '🥐' },
  pottery:  { label: 'Art & Pottery', emoji: '🏺', note: { title: 'Gallery Openings', body: 'We host a gallery opening on the first Friday of every month. Come meet the makers, hear the stories.', bg: 'bg-dusty-light' } },
}

export default function Menu() {
  const [active, setActive] = useState('espresso')
  const [apiMenu, setApiMenu] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    getMenu()
      .then(data => { setApiMenu(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  // Build the display object — API data takes precedence, fallback to static
  const displayMenu = apiMenu
    ? Object.fromEntries(
        Object.entries(apiMenu).map(([key, items]) => [
          key,
          {
            ...(categoryMeta[key] || { label: key, emoji: '☕' }),
            items: items.map(i => ({ name: i.name, desc: i.description, price: i.price })),
          },
        ])
      )
    : menu

  // Ensure active tab is valid for current menu
  const availableTabs = Object.keys(displayMenu)
  const currentActive = availableTabs.includes(active) ? active : availableTabs[0] || 'espresso'
  const cat = displayMenu[currentActive]

  if (loading) return (
    <main className="pt-16 min-h-screen bg-parchment flex items-center justify-center">
      <p className="font-sans text-walnut/40 text-sm tracking-widest uppercase">Loading menu…</p>
    </main>
  )

  if (error) return (
    <main className="pt-16 min-h-screen bg-parchment flex items-center justify-center">
      <p className="font-sans text-dusty text-sm">We're having trouble loading the menu. Please refresh.</p>
    </main>
  )

  return (
    <main className="pt-16 min-h-screen bg-parchment">

      {/* ── Header ── */}
      <div className="relative bg-espresso py-24 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, #f9f4ec 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="relative">
          <p className="font-sans text-clay text-xs tracking-widest uppercase mb-3">What We Serve</p>
          <h1 className="font-serif text-parchment text-5xl md:text-6xl mb-4">The Menu</h1>
          <p className="font-sans text-parchment/40 text-sm max-w-sm mx-auto">
            All espresso drinks use our in-house roasted beans. ✦ marks our house originals.
          </p>
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div className="sticky top-16 z-40 bg-parchment/95 backdrop-blur-sm border-b border-walnut/10">
        <div className="max-w-4xl mx-auto px-4 flex overflow-x-auto">
          {Object.entries(displayMenu).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`flex items-center gap-2 font-sans text-xs tracking-widest uppercase px-4 py-4 whitespace-nowrap transition-colors border-b-2 -mb-px ${
                currentActive === key
                  ? 'text-clay border-clay'
                  : 'text-walnut/50 border-transparent hover:text-walnut'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Items ── */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="font-serif text-espresso text-3xl mb-2">{cat.label}</h2>
        <div className="w-8 h-px bg-clay mb-12" />

        <div className="divide-y divide-walnut/8">
          {cat.items.map(item => (
            <div key={item.name} className="py-6 flex justify-between items-start gap-8">
              <div className="flex-1">
                <h3 className="font-serif text-espresso text-lg mb-1">{item.name}</h3>
                <p className="font-sans text-walnut/55 text-sm leading-relaxed">{item.desc}</p>
              </div>
              <span className="font-sans text-clay text-sm font-medium whitespace-nowrap pt-1 shrink-0">
                {item.price}
              </span>
            </div>
          ))}
        </div>

        {cat.note && (
          <div className={`mt-10 ${cat.note.bg} p-6`}>
            <p className="font-sans text-xs tracking-widest uppercase text-walnut/50 mb-2">{cat.note.title}</p>
            <p className="font-sans text-walnut/65 text-sm leading-relaxed">{cat.note.body}</p>
          </div>
        )}
      </div>
    </main>
  )
}
