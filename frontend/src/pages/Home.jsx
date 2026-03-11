import { Link, useNavigate } from 'react-router-dom'

// Pinterest board image URLs
const p = id => `https://i.pinimg.com/originals/${id.slice(0,2)}/${id.slice(2,4)}/${id.slice(4,6)}/${id}.jpg`

const IMGS = {
  hero:       p('6958d1a5f46e5c658f0c335ced87e933'), // rainy cozy window — candles, coffee, warmth
  cardRoast:  p('178a439cdc71e178fe61914017699532'), // yellow kiosk with flower roof
  cardBooks:  p('e398a0bcafc910b6e5c0870643dba010'), // chalk lettering — literary
  cardPottery:p('3b4d3cf4c919ae6659644ecdc0a759cd'), // hand-made ceramic with poppy
  cardWork:   p('bb2ec3f653d719d8192b2535375c15bf'), // white wall, coffee quote, plant — calm
}

const features = [
  { icon: '☕', label: 'In-House Roastery', desc: 'Single-origin beans roasted on-site, three times a week.' },
  { icon: '📚', label: 'Books Everywhere',  desc: 'A curated library lining every wall — borrow freely.' },
  { icon: '🎵', label: 'Hi-Fi Sound',       desc: 'Reference-grade speakers. Vinyl at weekends.' },
  { icon: '🏺', label: 'Art & Pottery',     desc: 'Local ceramicists and artists, rotating quarterly.' },
  { icon: '💻', label: 'Work-Friendly',     desc: 'Fast wifi, power at every seat, quiet nooks.' },
]

const spaceCards = [
  {
    title: 'The Roastery',
    tag: '☕  In-House Roasted',
    body: 'Our drum roaster sits behind glass at the heart of the café. On roasting days the whole room fills with the warm, nutty scent of beans transforming. Small batches, always — beans available to take home by the bag.',
    img: IMGS.cardRoast,
  },
  {
    title: 'Books & Hi-Fi Sound',
    tag: '📚  Curated Library',
    body: 'Shelves wrap every wall with hundreds of curated volumes — borrow one, bring one back someday. All of this unfolds beneath our reference-grade speaker system: jazz at noon, ambient at dusk.',
    img: IMGS.cardBooks,
  },
  {
    title: 'Local Art & Pottery',
    tag: '🏺  Rotating Gallery',
    body: 'Every piece of pottery you drink from was thrown by a local artist. Every painting on the wall is for sale. We rotate our gallery quarterly and host openings the first Friday of every month.',
    img: IMGS.cardPottery,
  },
  {
    title: 'Work & Stay',
    tag: '💻  Remote-Friendly',
    body: 'High-speed wifi. Power at every seat. Long tables for focus, soft corners for thought. A third place — not a home, not an office, but something richer than both.',
    img: IMGS.cardWork,
  },
]

const drinks = [
  {
    name: 'Honey Walnut Latte',
    desc: 'Our signature. Espresso, oat milk, house honey syrup, toasted walnut.',
    price: '€5.80',
  },
  {
    name: 'Single Origin Pour Over',
    desc: 'Rotating origins from our roastery. Ask your barista what\'s on today.',
    price: '€5.50',
  },
  {
    name: 'Rose Cardamom Latte',
    desc: 'Fragrant and floral. Rose water, cardamom, steamed oat milk.',
    price: '€5.80',
  },
]

const heroNav = [
  { num: '01', label: 'Menu',    to: '/menu' },
  { num: '02', label: 'Our Story', to: '/about' },
  { num: '03', label: 'Gallery', to: '/gallery' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <main>

      {/* ── Hero — Olivo cinematic photo + Meron numbered nav ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ backgroundImage: `url(${IMGS.hero})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-espresso/65" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto pb-24">
          {/* H&G badge */}
          <div className="w-14 h-14 bg-parchment/10 border border-parchment/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="font-serif text-parchment text-sm font-bold tracking-widest">H&amp;G</span>
          </div>

          <p className="font-sans text-clay/70 tracking-[0.45em] uppercase text-xs mb-8">
            Specialty Coffee &amp; Roastery
          </p>

          <h1 className="font-serif text-parchment leading-none mb-8" style={{ fontSize: 'clamp(3.5rem, 11vw, 8.5rem)' }}>
            Hearth<br />
            <span className="text-clay italic">&amp;</span><br />
            Grounds
          </h1>

          <p className="font-sans text-parchment/45 text-base max-w-xs mx-auto mb-12 leading-relaxed">
            Where every cup is a ritual, every corner a story, and every sip an invitation to stay a while.
          </p>

          <Link
            to="/menu"
            className="bg-clay text-parchment font-sans text-xs tracking-widest uppercase px-9 py-3.5 hover:bg-clay/80 transition-colors"
          >
            Explore the Menu
          </Link>
        </div>

        {/* Meron-style numbered section nav at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-parchment/10 grid grid-cols-3 z-10">
          {heroNav.map(({ num, label, to }) => (
            <Link
              key={to}
              to={to}
              className="py-5 text-center border-r border-parchment/10 last:border-r-0 hover:bg-parchment/5 transition-colors group"
            >
              <span className="font-serif italic text-parchment/20 text-xl block group-hover:text-parchment/35 transition-colors">
                {num}
              </span>
              <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-parchment/45 mt-0.5 block group-hover:text-parchment/70 transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Feature strip ── */}
      <section className="bg-linen py-14 px-6 border-b border-walnut/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {features.map(f => (
            <div key={f.label} className="text-center">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-serif text-espresso text-sm mb-1">{f.label}</h3>
              <p className="font-sans text-walnut/50 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Welcome ── */}
      <section className="py-24 px-6 bg-parchment">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-sans text-clay text-xs tracking-widest uppercase mb-5">Welcome</p>
          <h2 className="font-serif text-espresso text-4xl md:text-5xl mb-8 leading-tight">
            More than a coffee house.<br />A place to belong.
          </h2>
          <p className="font-sans text-walnut/60 text-base leading-relaxed">
            Hearth &amp; Grounds was born from a simple belief: that great coffee, beautiful spaces, and meaningful
            craft belong together. We roast in-house, curate local art, host a library of well-loved books, and pipe
            audiophile sound through every corner — so you can arrive as a stranger and leave feeling like a regular.
          </p>
        </div>
      </section>

      {/* ── Space cards — Olivo photo-backed ── */}
      <section className="bg-parchment pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="font-sans text-center text-clay text-xs tracking-widest uppercase mb-3">The Experience</p>
          <h2 className="font-serif text-center text-espresso text-4xl mb-10">Four reasons to stay</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {spaceCards.map(card => (
              <div
                key={card.title}
                className="relative overflow-hidden group min-h-[320px] flex flex-col justify-end p-8"
                style={{ backgroundImage: `url(${card.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0 bg-espresso/60 group-hover:bg-espresso/50 transition-colors duration-500" />
                <div className="relative z-10">
                  <span className="font-sans text-[10px] text-parchment/40 mb-3 block tracking-widest uppercase">
                    {card.tag}
                  </span>
                  <h3 className="font-serif text-parchment text-2xl mb-3">{card.title}</h3>
                  <p className="font-sans text-parchment/65 text-sm leading-relaxed">{card.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured drinks ── */}
      <section className="py-20 px-6 bg-linen">
        <div className="max-w-5xl mx-auto">
          <p className="font-sans text-center text-clay text-xs tracking-widest uppercase mb-3">From the Menu</p>
          <h2 className="font-serif text-center text-espresso text-4xl mb-14">A taste of what's waiting</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {drinks.map(drink => (
              <div key={drink.name} className="border-t border-walnut/15 pt-8">
                <div className="flex justify-between items-baseline mb-3">
                  <h3 className="font-serif text-espresso text-xl">{drink.name}</h3>
                  <span className="font-sans text-clay text-sm ml-3 shrink-0">{drink.price}</span>
                </div>
                <p className="font-sans text-walnut/55 text-sm leading-relaxed">{drink.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-14">
            <Link
              to="/menu"
              className="font-sans text-xs tracking-widest uppercase text-walnut/60 border-b border-walnut/25 pb-0.5 hover:text-clay hover:border-clay transition-colors"
            >
              View Full Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quote banner — Olivo text-over-dark ── */}
      <section className="bg-espresso py-28 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="font-sans text-clay/60 text-[10px] tracking-[0.5em] uppercase mb-8">Our Philosophy</p>
          <p className="font-serif text-parchment/85 text-2xl md:text-4xl leading-relaxed italic mb-8">
            "Good coffee is the beginning. Everything else — the books, the music, the art — is what makes you come back."
          </p>
          <div className="w-8 h-px bg-clay/40 mx-auto" />
        </div>
      </section>

      {/* ── Find us teaser ── */}
      <section className="py-20 px-6 bg-clay-light text-center">
        <p className="font-sans text-clay text-xs tracking-widest uppercase mb-4">Come In</p>
        <h2 className="font-serif text-espresso text-4xl mb-5">We'll have the kettle on.</h2>
        <p className="font-sans text-walnut/60 text-sm mb-8">
          Mon – Fri 7:00–20:00 · Sat 8:00–21:00 · Sun 9:00–18:00
        </p>
        <Link
          to="/gallery"
          className="font-sans text-xs tracking-widest uppercase text-espresso border-b border-espresso/30 pb-0.5 hover:text-clay hover:border-clay transition-colors"
        >
          Find Us &amp; Get in Touch →
        </Link>
      </section>

    </main>
  )
}
