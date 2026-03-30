import { Link } from 'react-router-dom'

// Pinterest board image URLs
const p = id => `https://i.pinimg.com/originals/${id.slice(0,2)}/${id.slice(2,4)}/${id.slice(4,6)}/${id}.jpg`

const IMGS = {
  storefront: p('6b7ef280b2db73a9192a94f8b1d3bc73'), // green vintage "THE COFFE" shop — charming exterior
  roastery:   p('a11e0560c5df040035bd4d93100d2591'), // blue glass coffee shop — clean, modern
  library:    p('be263c6e374e430f49e9b98dfac061d8'), // European cafe green shutters
  sound:      p('503225d527ce59204f525fff5c2818c0'), // colorful interior — vibrant / warm
  gallery:    p('3b4d3cf4c919ae6659644ecdc0a759cd'), // hand-made ceramic with poppy
}

const values = [
  { title: 'Direct Trade',  body: "We buy directly from farmers we've visited. Every bag tells you who grew it, where, and when." },
  { title: 'Local First',   body: 'Art, pottery, bread, flowers — everything we can source locally, we do. Our city is full of makers who deserve a platform.' },
  { title: 'Slow is Good',  body: "No drive-through. No conveyor-belt service. Come when you have time to stay, and we'll make that time worth something." },
  { title: 'Sound Matters', body: 'We believe the music you hear while you drink shapes how the coffee tastes. We take both seriously.' },
]

const spaceHighlights = [
  {
    label: 'The Library',
    body: 'Hundreds of books line every wall — art, philosophy, fiction, food. Borrow freely. Return whenever. Leave a note in the margins if you must.',
    img: IMGS.library,
  },
  {
    label: 'The Sound System',
    body: 'Reference-grade speakers anchored by a tube amplifier. We play vinyl at weekends. The playlist is always intentional, the volume always respectful of conversation.',
    img: IMGS.sound,
  },
  {
    label: 'The Gallery',
    body: 'Every piece on our walls is for sale. Every mug in your hand was thrown by a local artist. Exhibitions rotate quarterly. Openings on the first Friday of each month.',
    img: IMGS.gallery,
  },
]

export default function About() {
  return (
    <main className="pt-16 min-h-screen bg-parchment">

      {/* ── Header ── */}
      <div className="relative bg-espresso py-28 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #f9f4ec 1px, transparent 1px)', backgroundSize: '26px 26px' }}
        />
        <div className="relative">
          <p className="font-sans text-clay text-xs tracking-widest uppercase mb-4">Our Story</p>
          <h1 className="font-serif text-parchment text-5xl md:text-6xl mb-5 leading-tight">
            Built from a dream<br />of the perfect café.
          </h1>
          <p className="font-sans text-parchment/40 text-sm max-w-xs mx-auto">
            Part roastery. Part bookshop. Part gallery. Part sound system. All coffee house.
          </p>
        </div>
      </div>

      {/* ── Full-bleed storefront — Olivo style ── */}
      <section
        className="relative h-[60vh] flex items-end overflow-hidden"
        style={{ backgroundImage: `url(${IMGS.storefront})`, backgroundSize: 'cover', backgroundPosition: 'center 40%' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent" />
        <div className="relative z-10 px-10 pb-12 max-w-2xl">
          <p className="font-sans text-clay text-xs tracking-widest uppercase mb-3">Chapter One</p>
          <h2 className="font-serif text-parchment text-3xl md:text-4xl leading-tight">
            A café the way we always imagined it.
          </h2>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-5 font-sans text-walnut/65 text-base leading-relaxed">
            <p>
              Hearth &amp; Grounds started as a sketch in a notebook — a list of everything we wished existed
              in one place. Great specialty coffee, yes. But also: a room full of books you could actually borrow.
              Ceramics you could actually buy. Music played through speakers that actually sounded like the
              recording deserved.
            </p>
            <p>
              We spent years refining the idea: studying roasting, visiting farms in Ethiopia and Colombia,
              apprenticing under ceramicists, collecting records, and obsessing over speaker placement. Every
              detail was deliberate.
            </p>
            <p>
              When we finally opened our doors, the queue of regulars on the first morning told us we'd gotten
              it right. They came for the coffee. They stayed for everything else.
            </p>
          </div>
        </div>
      </section>

      {/* ── The Roastery ── */}
      <section className="bg-clay-light py-0 overflow-hidden">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 items-stretch">
          {/* Image side */}
          <div className="h-80 md:h-full min-h-[400px] overflow-hidden">
            <img
              src={IMGS.roastery}
              alt="In-house drum roaster"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Text side */}
          <div className="p-12 flex flex-col justify-center">
            <p className="font-sans text-clay text-xs tracking-widest uppercase mb-5">The Roastery</p>
            <h2 className="font-serif text-espresso text-3xl md:text-4xl mb-7 leading-tight">
              From green to golden,<br />right before your eyes.
            </h2>
            <div className="space-y-4 font-sans text-walnut/65 text-sm leading-relaxed">
              <p>
                Our drum roaster sits behind glass at the back of the café. On roasting days, the whole room
                fills with the warm, nutty scent of beans in transformation. We roast three times a week —
                always in small batches, always with intention.
              </p>
              <p>
                We source directly from farmers we've visited in Ethiopia's Yirgacheffe region, Colombia's
                Huila department, and Guatemala's Antigua highlands. Every bag carries the farmer's name and
                harvest notes.
              </p>
              <p>
                Beans are available in 250g bags to take home. Ask your barista about the current selection,
                or taste before you buy with a pour over or AeroPress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Space ── */}
      <section className="py-24 px-6 bg-parchment">
        <div className="max-w-5xl mx-auto">
          <p className="font-sans text-center text-clay text-xs tracking-widest uppercase mb-3">The Space</p>
          <h2 className="font-serif text-center text-espresso text-4xl mb-16">Designed to keep you here</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {spaceHighlights.map(s => (
              <div key={s.label}>
                <div className="overflow-hidden mb-5 h-52">
                  <img
                    src={s.img}
                    alt={s.label}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-serif text-espresso text-xl mb-3">{s.label}</h3>
                <p className="font-sans text-walnut/55 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="py-24 px-6 bg-sage-light/30">
        <div className="max-w-4xl mx-auto">
          <p className="font-sans text-center text-clay text-xs tracking-widest uppercase mb-3">How We Work</p>
          <h2 className="font-serif text-center text-espresso text-4xl mb-16">Our values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map(v => (
              <div key={v.title} className="border-l-2 border-clay pl-6 py-2">
                <h3 className="font-serif text-espresso text-xl mb-2">{v.title}</h3>
                <p className="font-sans text-walnut/55 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-espresso text-center">
        <h2 className="font-serif text-parchment text-4xl mb-5">Come visit us.</h2>
        <p className="font-sans text-parchment/40 text-sm mb-10 max-w-xs mx-auto">
          We'll have the kettle on and a seat with your name on it.
        </p>
        <div className="flex gap-5 justify-center flex-wrap">
          <Link
            to="/menu"
            className="bg-clay text-parchment font-sans text-xs tracking-widest uppercase px-8 py-3.5 hover:bg-clay/80 transition-colors"
          >
            See the Menu
          </Link>
          <Link
            to="/gallery"
            className="border border-parchment/25 text-parchment/70 font-sans text-xs tracking-widest uppercase px-8 py-3.5 hover:border-parchment/50 hover:text-parchment transition-colors"
          >
            Find Us →
          </Link>
        </div>
      </section>
    </main>
  )
}
