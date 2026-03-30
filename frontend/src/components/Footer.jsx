import { Link } from 'react-router-dom'

const navLinks = [
  ['/','Home'],
  ['/menu','Menu'],
  ['/about','Our Story'],
  ['/gallery','Gallery & Contact'],
  ['/reserve','Reserve a Table'],
]

export default function Footer() {
  return (
    <footer className="bg-espresso text-parchment/70">
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">

        {/* Brand */}
        <div>
          <h3 className="font-serif text-parchment text-2xl mb-4">Hearth &amp; Grounds</h3>
          <p className="font-sans text-sm leading-relaxed mb-6 text-parchment/50">
            A specialty coffee house, roastery, and gathering place for those who seek warmth,
            quality, and community in equal measure.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-sans text-xs tracking-widest uppercase text-parchment/30 mb-5">Navigate</h4>
          <ul className="space-y-3">
            {navLinks.map(([to, label]) => (
              <li key={to}>
                <Link
                  to={to}
                  className="font-sans text-sm text-parchment/60 hover:text-clay transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4 className="font-sans text-xs tracking-widest uppercase text-parchment/30 mb-5">Opening Hours</h4>
          <ul className="space-y-2 font-sans text-sm text-parchment/60">
            <li className="flex justify-between max-w-xs"><span>Mon – Fri</span><span>7:00 – 20:00</span></li>
            <li className="flex justify-between max-w-xs"><span>Saturday</span><span>8:00 – 21:00</span></li>
            <li className="flex justify-between max-w-xs"><span>Sunday</span><span>9:00 – 18:00</span></li>
          </ul>
          <div className="mt-6 font-sans text-sm text-parchment/40 space-y-1">
            <p>Carrer de la Mar, 12</p>
            <p>Can Picafort, Mallorca 07458</p>
            <p className="mt-2">hello@hearthandgrounds.com</p>
          </div>
        </div>
      </div>

      <div className="border-t border-parchment/10 py-5 px-6 text-center">
        <p className="font-sans text-xs text-parchment/25">
          © 2025 Hearth &amp; Grounds. Crafted with care.
        </p>
      </div>
    </footer>
  )
}
