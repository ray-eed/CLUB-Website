// pages/MemberDirectory.jsx
//
// Public-facing list of all club members.
// Features:
//   - Live search by name (filters as you type)
//   - Role filter (All / Admin / Executive / Member)
//   - Grid of profile cards (avatar, name, role, bio, socials)

import { useState } from 'react'

// ── Placeholder member data ───────────────────────────────────────────────────
// In the final version, this will be fetched from Firestore.
// For now, we hardcode 9 sample members.

const MEMBERS = [
  {
    uid:     'user_001',
    name:    'Nadia Islam',
    role:    'admin',
    title:   'President',
    bio:     'Portrait and documentary photographer. Believes every face has a story waiting to be told.',
    socials: { instagram: '#', linkedin: '#' },
    uploads: 24,
    initial: 'N',
    gradient: 'from-rose-500 to-orange-400',
  },
  {
    uid:     'user_002',
    name:    'Rafid Hasan',
    role:    'executive',
    title:   'Creative Director',
    bio:     'Digital artist and illustrator. Specialises in abstract fluid art and generative design.',
    socials: { instagram: '#' },
    uploads: 18,
    initial: 'R',
    gradient: 'from-violet-500 to-purple-400',
  },
  {
    uid:     'user_003',
    name:    'Sadia Akter',
    role:    'executive',
    title:   'Photography Lead',
    bio:     'Street photographer roaming Dhaka with a film camera. Captures the chaos and beauty of city life.',
    socials: { instagram: '#', linkedin: '#' },
    uploads: 31,
    initial: 'S',
    gradient: 'from-sky-500 to-cyan-400',
  },
  {
    uid:     'user_004',
    name:    'Omar Faruk',
    role:    'member',
    title:   'Member',
    bio:     'Concept artist and illustrator. Draws inspiration from mythology, dreams, and surreal landscapes.',
    socials: { instagram: '#' },
    uploads: 9,
    initial: 'O',
    gradient: 'from-emerald-500 to-teal-400',
  },
  {
    uid:     'user_005',
    name:    'Tasnim Chowdhury',
    role:    'member',
    title:   'Member',
    bio:     'Architectural and travel photographer. Has shot in 7 countries across South and Southeast Asia.',
    socials: { instagram: '#', linkedin: '#' },
    uploads: 15,
    initial: 'T',
    gradient: 'from-amber-500 to-yellow-400',
  },
  {
    uid:     'user_006',
    name:    'Mahir Rahman',
    role:    'executive',
    title:   'Events Coordinator',
    bio:     'Event and sports photographer. Loves the energy of live moments frozen in a single frame.',
    socials: { linkedin: '#' },
    uploads: 12,
    initial: 'M',
    gradient: 'from-pink-500 to-rose-400',
  },
  {
    uid:     'user_007',
    name:    'Rina Begum',
    role:    'member',
    title:   'Member',
    bio:     'Watercolour artist and nature lover. Her work explores the intersection of botany and fine art.',
    socials: { instagram: '#' },
    uploads: 7,
    initial: 'R',
    gradient: 'from-lime-500 to-green-400',
  },
  {
    uid:     'user_008',
    name:    'Farhan Kabir',
    role:    'member',
    title:   'Member',
    bio:     'Cinematic photographer and videographer. Studies light the way a painter studies colour.',
    socials: { instagram: '#', linkedin: '#' },
    uploads: 20,
    initial: 'F',
    gradient: 'from-indigo-500 to-blue-400',
  },
  {
    uid:     'user_009',
    name:    'Lamia Sultana',
    role:    'executive',
    title:   'Social Media Lead',
    bio:     'Visual storyteller and content creator. Manages the club\'s creative presence online.',
    socials: { instagram: '#', linkedin: '#' },
    uploads: 16,
    initial: 'L',
    gradient: 'from-fuchsia-500 to-pink-400',
  },
]

// The role filter options
const ROLE_FILTERS = [
  { key: 'all',       label: 'All'        },
  { key: 'admin',     label: 'Admin'      },
  { key: 'executive', label: 'Executive'  },
  { key: 'member',    label: 'Member'     },
]

// Role badge styles
const ROLE_STYLE = {
  admin:     'text-amber-muted   border-amber-muted/30   bg-amber-muted/10',
  executive: 'text-rose-gold     border-rose-gold/30     bg-rose-gold/10',
  member:    'text-white/50      border-white/20         bg-white/5',
}

// ── Component ─────────────────────────────────────────────────────────────────
function MemberDirectory() {
  // Search query — updates as user types
  const [search, setSearch]       = useState('')

  // Active role filter — 'all', 'admin', 'executive', or 'member'
  const [roleFilter, setRoleFilter] = useState('all')

  // FILTERING LOGIC:
  // 1. First filter by role (if not 'all')
  // 2. Then filter by name search (case-insensitive)
  // Both filters run together every time state changes.
  const filteredMembers = MEMBERS.filter((m) => {
    const matchesRole   = roleFilter === 'all' || m.role === roleFilter
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase())
    return matchesRole && matchesSearch
  })

  return (
    <div className="bg-surface-800 min-h-screen pt-16">

      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-rose-gold mb-3">
          The Team
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight">
          Meet the
          <span className="italic text-rose-gold"> Members</span>
        </h1>
        <p className="font-body text-white/50 mt-4 max-w-lg leading-relaxed">
          {MEMBERS.length} creative minds making up BUAPS. Explore their
          profiles, see their work, and connect.
        </p>
      </div>

      {/* ── Search + Filter bar ───────────────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-surface-800/90 backdrop-blur-sm border-b border-surface-500/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

          {/* Search input */}
          {/*
            onChange fires every time the user types a character.
            e.target.value is whatever is currently in the input box.
            We store it in `search` state, which triggers a re-filter.
          */}
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full pl-9 pr-4 py-2.5 rounded-full
                bg-surface-700 border border-surface-500/40
                font-body text-sm text-white placeholder-white/30
                focus:outline-none focus:border-rose-gold/50
                transition-colors duration-200
              "
            />
          </div>

          {/* Role filter pills */}
          <div className="flex gap-2 flex-wrap">
            {ROLE_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setRoleFilter(f.key)}
                className={`
                  px-4 py-1.5 rounded-full font-body text-xs tracking-wide
                  border transition-all duration-200
                  ${roleFilter === f.key
                    ? 'bg-rose-gold border-rose-gold text-white'
                    : 'border-surface-500/40 text-white/50 hover:text-white hover:border-white/30'
                  }
                `}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Members grid ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Result count */}
        <p className="font-body text-xs text-white/30 mb-8 uppercase tracking-widest">
          Showing {filteredMembers.length} of {MEMBERS.length} members
        </p>

        {filteredMembers.length === 0 ? (
          // Empty state
          <div className="text-center py-24">
            <p className="font-display text-2xl text-white/20">
              No members match your search.
            </p>
            <button
              onClick={() => { setSearch(''); setRoleFilter('all') }}
              className="mt-4 font-body text-sm text-rose-gold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          // 3-column grid (1 col mobile, 2 tablet, 3 desktop)
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <MemberCard key={member.uid} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── MemberCard sub-component ──────────────────────────────────────────────────
function MemberCard({ member }) {
  return (
    <div className="
      bg-surface-700 border border-surface-500/30 rounded-2xl p-6
      transition-all duration-300
      hover:-translate-y-1 hover:border-rose-gold/20
      hover:shadow-xl hover:shadow-black/40
      group flex flex-col
    ">
      {/* ── Top row: avatar + name + role ── */}
      <div className="flex items-start gap-4 mb-4">

        {/* Gradient avatar circle with member's initial */}
        {/*
          bg-gradient-to-br applies a diagonal gradient.
          The specific gradient colours come from member.gradient.
          This gives each member a unique coloured avatar automatically.
        */}
        <div className={`
          flex-shrink-0 w-14 h-14 rounded-full
          bg-gradient-to-br ${member.gradient}
          flex items-center justify-center
          font-display text-xl font-bold text-white
          shadow-lg transition-transform duration-300 group-hover:scale-110
        `}>
          {member.initial}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-semibold text-white truncate">
            {member.name}
          </h3>
          <p className="font-body text-xs text-white/40 mb-2">{member.title}</p>

          {/* Role badge */}
          <span className={`
            inline-block font-body text-[10px] uppercase tracking-wider
            px-2.5 py-0.5 rounded-full border
            ${ROLE_STYLE[member.role]}
          `}>
            {member.role}
          </span>
        </div>
      </div>

      {/* Bio */}
      <p className="font-body text-sm text-white/50 leading-relaxed flex-1 mb-4">
        {member.bio}
      </p>

      {/* ── Bottom row: uploads count + socials ── */}
      <div className="flex items-center justify-between pt-4 border-t border-surface-500/20">

        {/* Upload count */}
        <p className="font-body text-xs text-white/30">
          <span className="text-white/60 font-medium">{member.uploads}</span> works
        </p>

        {/* Social icon links */}
        <div className="flex gap-3">
          {member.socials.instagram && (
            <a
              href={member.socials.instagram}
              className="font-body text-xs text-white/30 hover:text-rose-gold transition-colors duration-200"
              aria-label="Instagram"
            >
              {/* Instagram icon using unicode symbol */}
              IG
            </a>
          )}
          {member.socials.linkedin && (
            <a
              href={member.socials.linkedin}
              className="font-body text-xs text-white/30 hover:text-sky-400 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              LI
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default MemberDirectory
