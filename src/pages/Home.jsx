// pages/Home.jsx
//
// The landing page — the very first thing visitors see.
// Five sections:
//   1. Hero         — full-screen banner with headline + CTAs
//   2. Stats        — 4 at-a-glance numbers about the club
//   3. About        — brief club intro + mission
//   4. Announcements — 3 latest news cards
//   5. Highlights   — 3 featured works from the gallery

import { Link } from 'react-router-dom'
import heroBg   from '../assets/hero_bg.jpg'

// ── Placeholder data ─────────────────────────────────────────────────────────
// Later these will come from Firestore. For now, hardcoded.

const ANNOUNCEMENTS = [
  {
    id: 1,
    tag: 'Exhibition',
    date: 'Aug 10, 2026',
    title: 'Annual Light & Shadow Exhibition',
    body:  'Submit your best monochrome work by Aug 8th. Top 20 selected pieces will be displayed in the LAB building gallery.',
  },
  {
    id: 2,
    tag: 'Workshop',
    date: 'Aug 15, 2026',
    title: 'Portrait Photography Masterclass',
    body:  'Join us for a hands-on portrait session with guest photographer Nashiha Rahman. Limited to 20 spots.',
  },
  {
    id: 3,
    tag: 'Deadline',
    date: 'Aug 20, 2026',
    title: 'National Photography Contest',
    body:  'BUAPS is entering the national inter-university contest. Submit your entries to the Creative Hub under the "Contest" tag.',
  },
]

const STATS = [
  { value: '120+', label: 'Active Members'   },
  { value: '340+', label: 'Works Published'  },
  { value: '6',    label: 'Years of Legacy'  },
  { value: '18',   label: 'Awards Won'       },
]

// Tag pill colours for announcement cards
const TAG_COLORS = {
  Exhibition: 'text-rose-gold  border-rose-gold/40  bg-rose-gold/10',
  Workshop:   'text-amber-muted border-amber-muted/40 bg-amber-muted/10',
  Deadline:   'text-red-400     border-red-400/40     bg-red-400/10',
}

// ── Component ────────────────────────────────────────────────────────────────
function Home() {
  return (
    // The outer div that holds all five sections
    <div className="bg-surface-800 min-h-screen">

      {/* ════════════════════════════════════════════════════════════
          SECTION 1 — HERO
          Full-screen banner. The hero image fills the background.
          A dark gradient sits on top of the image so our text stays
          readable. Then the text + buttons float above that.
      ════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark gradient overlay — sits between image and text */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-surface-800" />

        {/* Decorative floating rose gold orbs — purely visual */}
        <div className="absolute top-1/3 left-16 w-64 h-64 rounded-full bg-rose-gold/5 blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-1/3 right-16 w-48 h-48 rounded-full bg-amber-muted/5 blur-3xl animate-float delay-300 pointer-events-none" />

        {/* Hero content — centred, stacked vertically */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

          {/* Small label above the main heading */}
          <p className="
            font-body text-xs uppercase tracking-[0.3em] text-rose-gold/80
            mb-6 opacity-0 animate-fade-in-up
          ">
            BRAC University Art &amp; Photography Society
          </p>

          {/* Main heading in serif display font */}
          <h1 className="
            font-display text-5xl md:text-7xl font-bold text-white leading-tight
            mb-6 opacity-0 animate-fade-in-up delay-200
          ">
            Where Art
            <span className="block italic text-rose-gold">Meets the Lens.</span>
          </h1>

          {/* Tagline / subtitle */}
          <p className="
            font-body text-lg md:text-xl text-white/60 max-w-2xl mx-auto
            mb-10 opacity-0 animate-fade-in-up delay-300
          ">
            A creative sanctuary at BRAC University — capturing moments,
            crafting stories, and building a community of visual artists.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up delay-500">
            {/* Primary button — filled rose gold */}
            <Link
              to="/creative-hub"
              className="
                px-8 py-3.5 rounded-full font-body font-medium tracking-wide
                bg-rose-gold text-white
                transition-all duration-300
                hover:bg-rose-gold-dark hover:shadow-xl hover:shadow-rose-gold/30
                hover:-translate-y-0.5
              "
            >
              Explore Gallery
            </Link>

            {/* Secondary button — outlined */}
            <Link
              to="/members"
              className="
                px-8 py-3.5 rounded-full font-body font-medium tracking-wide
                border border-white/30 text-white/80
                transition-all duration-300
                hover:border-white hover:text-white hover:bg-white/5
                hover:-translate-y-0.5
              "
            >
              Meet the Members
            </Link>
          </div>
        </div>

        {/* Scroll indicator — bounces at the bottom to hint at more content */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in-up delay-700">
          <span className="font-body text-[10px] uppercase tracking-widest text-white/30">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-scroll-bounce" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 2 — STATS
          A thin strip with 4 at-a-glance numbers.
          The slight gradient background separates it from the hero.
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-surface-700 border-y border-surface-500/30">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center group">
              <p className="font-display text-4xl md:text-5xl font-bold text-rose-gold transition-transform duration-300 group-hover:scale-110">
                {stat.value}
              </p>
              <p className="font-body text-sm text-white/50 mt-1 uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 3 — ABOUT
          Two-column layout: left = text, right = decorative quote.
      ════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* Left: text block */}
          <div>
            {/* Section label */}
            <p className="font-body text-xs uppercase tracking-[0.3em] text-rose-gold mb-4">
              About the Club
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-snug mb-6">
              A Community Built on
              <span className="italic text-rose-gold"> Creative Vision</span>
            </h2>
            <p className="font-body text-white/60 leading-relaxed mb-4">
              Founded in 2020, the BRAC University Art &amp; Photography Society (BUAPS)
              is a student-run creative collective dedicated to celebrating visual
              storytelling in all its forms.
            </p>
            <p className="font-body text-white/60 leading-relaxed mb-8">
              From photography walks around Dhaka to on-campus exhibitions, we create
              spaces where students can learn, experiment, and grow together as artists.
            </p>
            <Link
              to="/achievements"
              className="
                inline-flex items-center gap-2 font-body text-sm text-rose-gold
                border-b border-rose-gold/40 pb-0.5
                hover:border-rose-gold transition-colors duration-200
              "
            >
              View our achievements
              <span>→</span>
            </Link>
          </div>

          {/* Right: large decorative pull quote */}
          <div className="relative">
            {/* Background accent */}
            <div className="absolute -inset-4 bg-rose-gold/5 rounded-2xl blur-xl animate-glow-pulse" />
            <div className="relative bg-surface-700 border border-surface-500/40 rounded-2xl p-10">
              {/* Large opening quote mark */}
              <span className="font-display text-8xl text-rose-gold/20 leading-none block -mb-4">
                "
              </span>
              <p className="font-display text-xl md:text-2xl text-white/80 italic leading-relaxed">
                Every photograph is a certificate of presence.
              </p>
              <p className="font-body text-sm text-white/30 mt-6 tracking-wide">
                — Roland Barthes
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 4 — ANNOUNCEMENTS
          Three cards in a grid. Each has a tag, date, title, and body.
          The glassmorphism card style matches the dark gallery feel.
      ════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-surface-900">
        <div className="max-w-6xl mx-auto">

          {/* Section heading row */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.3em] text-rose-gold mb-2">
                Latest from the Club
              </p>
              <h2 className="font-display text-4xl font-bold text-white">
                Announcements
              </h2>
            </div>
          </div>

          {/* 3-column card grid (1 col on mobile) */}
          <div className="grid md:grid-cols-3 gap-6">
            {ANNOUNCEMENTS.map((item) => (
              <div
                key={item.id}
                className="
                  bg-surface-700 border border-surface-500/30 rounded-2xl p-6
                  transition-all duration-300
                  hover:-translate-y-1 hover:border-rose-gold/30
                  hover:shadow-xl hover:shadow-black/40
                  group
                "
              >
                {/* Tag pill + date on one line */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-body text-[11px] uppercase tracking-wider px-3 py-1 rounded-full border ${TAG_COLORS[item.tag] ?? 'text-white/50 border-white/20 bg-white/5'}`}>
                    {item.tag}
                  </span>
                  <span className="font-body text-xs text-white/30">
                    {item.date}
                  </span>
                </div>

                {/* Card title */}
                <h3 className="font-display text-lg font-semibold text-white mb-3 leading-snug group-hover:text-rose-gold transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Card body */}
                <p className="font-body text-sm text-white/50 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 5 — JOIN CTA
          A full-width dark strip inviting visitors to log in
          and become part of the community.
      ════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full bg-rose-gold/5 blur-3xl animate-glow-pulse" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-rose-gold mb-4">
            Be Part of the Story
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to share your
            <span className="italic text-rose-gold"> creative work?</span>
          </h2>
          <p className="font-body text-white/50 mb-10 leading-relaxed">
            Club members can upload art and photography, build a personal profile,
            track their activity, and connect with fellow creatives at BRAC.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/creative-hub"
              className="
                px-8 py-3.5 rounded-full font-body font-medium
                bg-rose-gold text-white tracking-wide
                transition-all duration-300
                hover:bg-rose-gold-dark hover:shadow-xl hover:shadow-rose-gold/30
                hover:-translate-y-0.5
              "
            >
              Browse the Gallery
            </Link>
            <Link
              to="/login"
              className="
                px-8 py-3.5 rounded-full font-body font-medium
                border border-rose-gold/40 text-rose-gold tracking-wide
                transition-all duration-300
                hover:bg-rose-gold/10 hover:border-rose-gold
                hover:-translate-y-0.5
              "
            >
              Member Login
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
