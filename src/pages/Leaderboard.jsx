// pages/Leaderboard.jsx
//
// Shows all members ranked by their activity score.
// Activity score = (uploads × 10) + (attendance sessions × 20)
//
// Only visible to logged-in members.
// If not logged in → shows a "members only" gate instead of redirecting,
// so visitors can at least SEE that it exists.

import useAuth from '../hooks/useAuth'
import { Link } from 'react-router-dom'

// ── Placeholder data ─────────────────────────────────────────────────────────
// In the real version this comes from getAllUsers() in firestore.js.
// Sorted by score descending.

const LEADERBOARD_DATA = [
  { uid: 'u3',  name: 'Sadia Akter',      role: 'executive', title: 'Photography Lead', uploads: 31, sessions: 18, gradient: 'from-sky-500 to-cyan-400',     initial: 'S' },
  { uid: 'u1',  name: 'Nadia Islam',      role: 'admin',     title: 'President',        uploads: 24, sessions: 22, gradient: 'from-rose-500 to-orange-400',  initial: 'N' },
  { uid: 'u8',  name: 'Farhan Kabir',     role: 'member',    title: 'Member',           uploads: 20, sessions: 14, gradient: 'from-indigo-500 to-blue-400',  initial: 'F' },
  { uid: 'u2',  name: 'Rafid Hasan',      role: 'executive', title: 'Creative Director',uploads: 18, sessions: 10, gradient: 'from-violet-500 to-purple-400',initial: 'R' },
  { uid: 'u9',  name: 'Lamia Sultana',    role: 'executive', title: 'Social Media Lead',uploads: 16, sessions: 12, gradient: 'from-fuchsia-500 to-pink-400', initial: 'L' },
  { uid: 'u5',  name: 'Tasnim Chowdhury', role: 'member',    title: 'Member',           uploads: 15, sessions: 9,  gradient: 'from-amber-500 to-yellow-400', initial: 'T' },
  { uid: 'u6',  name: 'Mahir Rahman',     role: 'executive', title: 'Events Coordinator',uploads:12, sessions: 16, gradient: 'from-pink-500 to-rose-400',   initial: 'M' },
  { uid: 'u4',  name: 'Omar Faruk',       role: 'member',    title: 'Member',           uploads: 9,  sessions: 7,  gradient: 'from-emerald-500 to-teal-400', initial: 'O' },
  { uid: 'u7',  name: 'Rina Begum',       role: 'member',    title: 'Member',           uploads: 7,  sessions: 5,  gradient: 'from-lime-500 to-green-400',   initial: 'R' },
]

// Calculate score: each upload = 10 pts, each session = 20 pts
const withScores = LEADERBOARD_DATA.map((m) => ({
  ...m,
  score: m.uploads * 10 + m.sessions * 20,
})).sort((a, b) => b.score - a.score) // sort highest score first

// Medal styles for top 3
const MEDAL = {
  0: { icon: '🥇', glow: 'shadow-amber-400/20',   ring: 'border-amber-400/60',  label: 'text-amber-400'  },
  1: { icon: '🥈', glow: 'shadow-slate-400/20',   ring: 'border-slate-400/40',  label: 'text-slate-400'  },
  2: { icon: '🥉', glow: 'shadow-orange-700/20',  ring: 'border-orange-700/40', label: 'text-orange-600' },
}

const ROLE_STYLE = {
  admin:     'text-amber-muted border-amber-muted/30 bg-amber-muted/10',
  executive: 'text-rose-gold   border-rose-gold/30   bg-rose-gold/10',
  member:    'text-white/40    border-white/15        bg-white/5',
}

function Leaderboard() {
  const { isLoggedIn, currentUser } = useAuth()

  // ── Members-only gate ────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="bg-surface-800 min-h-screen pt-16 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          {/* Lock icon */}
          <div className="w-20 h-20 rounded-full bg-rose-gold/10 border border-rose-gold/20 flex items-center justify-center mx-auto mb-6 text-3xl">
            🔒
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-3">
            Members Only
          </h1>
          <p className="font-body text-white/50 leading-relaxed mb-8">
            The Activity Leaderboard is exclusive to BUAPS club members.
            Log in to see how you rank among your fellow creatives.
          </p>
          <Link
            to="/login"
            className="
              inline-block px-8 py-3.5 rounded-full font-body font-medium
              bg-rose-gold text-white tracking-wide
              hover:bg-rose-gold-dark hover:shadow-lg hover:shadow-rose-gold/30
              transition-all duration-300
            "
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  // ── Logged in view ────────────────────────────────────────────────────────
  return (
    <div className="bg-surface-800 min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Page header */}
        <div className="mb-12">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-rose-gold mb-3">
            Season 2026
          </p>
          <h1 className="font-display text-5xl font-bold text-white mb-3">
            Activity
            <span className="italic text-rose-gold"> Leaderboard</span>
          </h1>
          <p className="font-body text-white/40 text-sm leading-relaxed">
            Ranked by activity score: each upload earns <span className="text-white/60">10 pts</span>,
            each attendance session earns <span className="text-white/60">20 pts</span>.
          </p>
        </div>

        {/* ── Top 3 podium cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {withScores.slice(0, 3).map((member, i) => {
            const medal = MEDAL[i]
            return (
              <div
                key={member.uid}
                className={`
                  bg-surface-700 border rounded-2xl p-5 text-center
                  shadow-xl ${medal.glow} ${medal.ring}
                  transition-all duration-300 hover:-translate-y-1
                  ${i === 0 ? 'scale-105 relative z-10' : ''}
                `}
              >
                <div className="text-2xl mb-3">{medal.icon}</div>
                {/* Avatar */}
                <div className={`
                  w-14 h-14 rounded-full bg-gradient-to-br ${member.gradient}
                  flex items-center justify-center mx-auto mb-3
                  font-display text-xl font-bold text-white shadow-lg
                `}>
                  {member.initial}
                </div>
                <p className="font-display text-base font-semibold text-white leading-tight mb-1">
                  {member.name}
                </p>
                <p className={`font-body text-2xl font-bold ${medal.label} mt-2`}>
                  {member.score}
                  <span className="text-xs text-white/30 font-normal ml-1">pts</span>
                </p>
              </div>
            )
          })}
        </div>

        {/* ── Full rankings table ────────────────────────────────────────── */}
        <div className="bg-surface-700 border border-surface-500/30 rounded-2xl overflow-hidden">

          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-6 py-3 border-b border-surface-500/30">
            <span className="col-span-1 font-body text-[11px] uppercase tracking-wider text-white/30">#</span>
            <span className="col-span-5 font-body text-[11px] uppercase tracking-wider text-white/30">Member</span>
            <span className="col-span-2 font-body text-[11px] uppercase tracking-wider text-white/30 text-center">Uploads</span>
            <span className="col-span-2 font-body text-[11px] uppercase tracking-wider text-white/30 text-center">Sessions</span>
            <span className="col-span-2 font-body text-[11px] uppercase tracking-wider text-white/30 text-right">Score</span>
          </div>

          {/* Rows */}
          {withScores.map((member, index) => {
            // Is this the currently logged-in user?
            const isMe = currentUser?.uid === member.uid

            return (
              <div
                key={member.uid}
                className={`
                  grid grid-cols-12 gap-2 px-6 py-4 items-center
                  border-b border-surface-500/20 last:border-0
                  transition-colors duration-200
                  ${isMe
                    ? 'bg-rose-gold/5 border-l-2 border-l-rose-gold'
                    : 'hover:bg-surface-600/40'
                  }
                `}
              >
                {/* Rank number */}
                <div className="col-span-1">
                  {index < 3 ? (
                    <span className="text-lg">{MEDAL[index].icon}</span>
                  ) : (
                    <span className="font-display text-lg font-bold text-white/20">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Avatar + name + role */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className={`
                    w-9 h-9 rounded-full bg-gradient-to-br ${member.gradient}
                    flex items-center justify-center flex-shrink-0
                    font-display text-sm font-bold text-white
                  `}>
                    {member.initial}
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-sm font-medium text-white truncate flex items-center gap-2">
                      {member.name}
                      {isMe && <span className="text-[10px] text-rose-gold">(you)</span>}
                    </p>
                    <span className={`inline-block font-body text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border mt-0.5 ${ROLE_STYLE[member.role]}`}>
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* Uploads */}
                <div className="col-span-2 text-center">
                  <span className="font-body text-sm text-white/70">{member.uploads}</span>
                </div>

                {/* Sessions */}
                <div className="col-span-2 text-center">
                  <span className="font-body text-sm text-white/70">{member.sessions}</span>
                </div>

                {/* Score */}
                <div className="col-span-2 text-right">
                  <span className="font-display text-base font-bold text-rose-gold">
                    {member.score}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <p className="font-body text-xs text-white/20 text-center mt-6">
          Score = (Uploads × 10) + (Attendance Sessions × 20) · Updated live
        </p>

      </div>
    </div>
  )
}

export default Leaderboard
