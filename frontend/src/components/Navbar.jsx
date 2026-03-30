import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/',        label: 'Home' },
  { to: '/menu',    label: 'Menu' },
  { to: '/about',   label: 'Our Story' },
  { to: '/gallery', label: 'Gallery & Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 70)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const glass = location.pathname === '/' && !scrolled

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        glass
          ? 'bg-transparent border-b border-parchment/10'
          : 'bg-parchment/95 backdrop-blur-sm border-b border-walnut/10'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${glass ? 'bg-parchment' : 'bg-espresso'}`}>
            <span className={`font-serif text-[10px] font-bold leading-none transition-colors duration-500 ${glass ? 'text-espresso' : 'text-parchment'}`}>
              H&amp;G
            </span>
          </div>
          <span className={`font-serif text-lg tracking-wide transition-colors duration-500 ${glass ? 'text-parchment group-hover:text-clay/80' : 'text-espresso group-hover:text-clay'}`}>
            Hearth &amp; Grounds
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-sans text-xs tracking-widest uppercase transition-colors duration-300 ${
                location.pathname === link.to
                  ? glass ? 'text-parchment border-b border-parchment/60 pb-0.5' : 'text-clay border-b border-clay pb-0.5'
                  : glass ? 'text-parchment/55 hover:text-parchment' : 'text-walnut/70 hover:text-clay'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden flex flex-col justify-center items-end gap-1 w-6 h-6 transition-colors duration-500 ${glass ? 'text-parchment' : 'text-espresso'}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block h-px w-6 bg-current transition-all duration-200 ${open ? 'rotate-45 translate-y-[5px]' : ''}`} />
          <span className={`block h-px bg-current transition-all duration-200 ${open ? 'opacity-0 w-6' : 'w-4'}`} />
          <span className={`block h-px w-6 bg-current transition-all duration-200 ${open ? '-rotate-45 -translate-y-[5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-parchment border-t border-walnut/10 px-6 py-4 space-y-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block font-sans text-xs tracking-widest uppercase py-3 transition-colors ${
                location.pathname === link.to ? 'text-clay' : 'text-walnut/70 hover:text-clay'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
