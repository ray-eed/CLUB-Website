// pages/Achievements.jsx
//
// Shows the club's journey and milestones in a timeline format,
// followed by a grid of major award cards.
//
// Sections:
//   1. Page header
//   2. Vertical timeline of milestones
//   3. Awards grid
//   4. Closing quote

// ── Placeholder data ──────────────────────────────────────────────────────────

const TIMELINE = [
  {
    year: '2020',
    title: 'Club Founded',
    description:
      'BUAPS was established by a group of 12 passionate students at BRAC University, beginning with a single photography walk around Dhaka.',
    tag: 'Origin',
  },
  {
    year: '2021',
    title: 'First Campus Exhibition',
    description:
      'Our debut on-campus exhibition drew over 400 visitors in two days. 30 student works were displayed across the UB (University Building) gallery space.',
    tag: 'Milestone',
  },
  {
    year: '2022',
    title: 'National Inter-University Photography Award',
    description:
      'BUAPS placed 1st in the National Student Photography Competition held in Chittagong, beating 24 other university clubs.',
    tag: 'Award',
  },
  {
    year: '2023',
    title: '100 Active Members',
    description:
      'The club crossed 100 active members — a landmark in our growth. Structured departments (Photography, Digital Art, Editorial) were formally established.',
    tag: 'Milestone',
  },
  {
    year: '2024',
    title: 'Featured in Daily Star Arts',
    description:
      'Our annual "Light & Shadow" exhibition was covered by The Daily Star\'s arts section, putting BUAPS on the national creative map.',
    tag: 'Recognition',
  },
  {
    year: '2025',
    title: 'Best Student Club — BRAC University',
    description:
      'Awarded "Best Student Club of the Year" by the BRAC University student governance body, recognising outstanding events and community impact.',
    tag: 'Award',
  },
  {
    year: '2026',
    title: 'International Collaboration',
    description:
      'Partnered with photography clubs from IUT and NSU for a joint exhibition project, marking BUAPS\'s first inter-university collaborative showcase.',
    tag: 'Current',
  },
]

const AWARDS = [
  {
    icon: '🏆',
    title: 'National Photography Championship',
    year: '2022',
    body: '1st Place, National Inter-University Photography Competition, Chittagong.',
  },
  {
    icon: '🥇',
    title: 'Best Student Club of the Year',
    year: '2025',
    body: 'Awarded by BRAC University Student Governance for excellence in creative programming.',
  },
  {
    icon: '📰',
    title: 'Press Feature — The Daily Star',
    year: '2024',
    body: 'Featured in the national daily for the "Light & Shadow" annual exhibition.',
  },
  {
    icon: '🎖️',
    title: 'Runner-Up — National Art Fest',
    year: '2023',
    body: '2nd Place in the Digital Art category at the National Student Art Festival, Dhaka.',
  },
]

// Tag pill colours
const TAG_STYLE = {
  Origin:      'text-violet-400  border-violet-400/30  bg-violet-400/10',
  Milestone:   'text-sky-400     border-sky-400/30     bg-sky-400/10',
  Award:       'text-amber-muted border-amber-muted/30 bg-amber-muted/10',
  Recognition: 'text-rose-gold   border-rose-gold/30   bg-rose-gold/10',
  Current:     'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
}

// ── Component ─────────────────────────────────────────────────────────────────
function Achievements() {
  return (
    <div className="bg-surface-800 min-h-screen pt-16">

      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-rose-gold mb-3">
          Our Story
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight max-w-xl">
          Milestones &amp;
          <span className="italic text-rose-gold"> Achievements</span>
        </h1>
        <p className="font-body text-white/50 mt-4 max-w-lg leading-relaxed">
          Six years of creativity, community, and recognition — here's how BUAPS
          grew from a small idea into BRAC University's most celebrated arts club.
        </p>
      </div>

      {/* ── Timeline ──────────────────────────────────────────────────── */}
      {/*
        Layout idea:
        - A vertical line on the left
        - A dot on the line for each milestone
        - The card content sits to the right of the line
        This is clean, readable, and responsive out of the box.
      */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        {/* Outer container — relative so we can position the vertical line */}
        <div className="relative">

          {/* The vertical connecting line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-rose-gold/60 via-surface-500/40 to-transparent" />

          {/* Loop through each milestone */}
          <div className="space-y-12">
            {TIMELINE.map((item, index) => (
              <div key={index} className="relative flex gap-8 group">

                {/* ── LEFT: Year badge + dot on the line ───── */}
                <div className="flex-shrink-0 flex flex-col items-center w-10">
                  {/* The dot — turns rose gold on hover */}
                  <div className="
                    w-4 h-4 rounded-full border-2 border-rose-gold/50 bg-surface-800
                    transition-all duration-300
                    group-hover:border-rose-gold group-hover:bg-rose-gold/20
                    mt-1 z-10
                  " />
                </div>

                {/* ── RIGHT: Card content ───────────────────── */}
                <div className="
                  flex-1 pb-2
                  bg-surface-700/50 border border-surface-500/20 rounded-2xl p-6
                  transition-all duration-300
                  group-hover:border-rose-gold/20 group-hover:bg-surface-700/80
                ">
                  {/* Year + tag on one row */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-display text-2xl font-bold text-rose-gold">
                      {item.year}
                    </span>
                    <span className={`font-body text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${TAG_STYLE[item.tag] ?? 'text-white/40 border-white/20 bg-white/5'}`}>
                      {item.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="font-body text-sm text-white/50 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Awards grid ───────────────────────────────────────────────── */}
      <section className="bg-surface-900 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-rose-gold mb-2">
              Honours
            </p>
            <h2 className="font-display text-4xl font-bold text-white">
              Awards &amp; Recognition
            </h2>
          </div>

          {/* 2×2 grid on desktop, 1 col on mobile */}
          <div className="grid md:grid-cols-2 gap-6">
            {AWARDS.map((award, index) => (
              <div
                key={index}
                className="
                  flex gap-5 items-start
                  bg-surface-700 border border-surface-500/30 rounded-2xl p-6
                  transition-all duration-300
                  hover:-translate-y-1 hover:border-amber-muted/30
                  hover:shadow-xl hover:shadow-black/40
                  group
                "
              >
                {/* Icon in a glowing circle */}
                <div className="
                  flex-shrink-0 w-14 h-14 rounded-full
                  bg-amber-muted/10 border border-amber-muted/20
                  flex items-center justify-center text-2xl
                  transition-all duration-300
                  group-hover:bg-amber-muted/20 group-hover:border-amber-muted/40
                ">
                  {award.icon}
                </div>

                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="font-display text-lg font-semibold text-white">
                      {award.title}
                    </h3>
                    <span className="font-body text-xs text-white/30">
                      {award.year}
                    </span>
                  </div>
                  <p className="font-body text-sm text-white/50 leading-relaxed">
                    {award.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing quote ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="font-display text-7xl text-rose-gold/20 leading-none block -mb-2">"</span>
          <p className="font-display text-2xl md:text-3xl italic text-white/70 leading-relaxed">
            The best camera is the one you have with you.
          </p>
          <p className="font-body text-sm text-white/30 mt-5 tracking-wide">
            — Chase Jarvis
          </p>
        </div>
      </section>

    </div>
  )
}

export default Achievements
