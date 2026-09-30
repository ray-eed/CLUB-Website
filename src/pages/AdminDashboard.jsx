// pages/AdminDashboard.jsx
//
// The admin control panel. Only visible to users with role = 'admin'.
// Shows:
//   - Quick stats (total members, uploads, sessions)
//   - Full member table with role, activity score, and quick info
//   - Link to Attendance scanner

import { Link }  from 'react-router-dom'
import useAuth   from '../hooks/useAuth'

// ── Placeholder data (replace with getAllUsers() from Firestore later) ────────
const MEMBERS = [
  { uid:'u1', name:'Nadia Islam',       role:'admin',     title:'President',         uploads:24, sessions:22, score:580, gradient:'from-rose-500 to-orange-400',  initial:'N' },
  { uid:'u2', name:'Rafid Hasan',       role:'executive', title:'Creative Director',  uploads:18, sessions:10, score:380, gradient:'from-violet-500 to-purple-400',initial:'R' },
  { uid:'u3', name:'Sadia Akter',       role:'executive', title:'Photography Lead',   uploads:31, sessions:18, score:670, gradient:'from-sky-500 to-cyan-400',     initial:'S' },
  { uid:'u4', name:'Omar Faruk',        role:'member',    title:'Member',             uploads: 9, sessions: 7, score:230, gradient:'from-emerald-500 to-teal-400', initial:'O' },
  { uid:'u5', name:'Tasnim Chowdhury',  role:'member',    title:'Member',             uploads:15, sessions: 9, score:330, gradient:'from-amber-500 to-yellow-400', initial:'T' },
  { uid:'u6', name:'Mahir Rahman',      role:'executive', title:'Events Coordinator', uploads:12, sessions:16, score:440, gradient:'from-pink-500 to-rose-400',    initial:'M' },
  { uid:'u7', name:'Rina Begum',        role:'member',    title:'Member',             uploads: 7, sessions: 5, score:170, gradient:'from-lime-500 to-green-400',   initial:'R' },
  { uid:'u8', name:'Farhan Kabir',      role:'member',    title:'Member',             uploads:20, sessions:14, score:480, gradient:'from-indigo-500 to-blue-400',  initial:'F' },
  { uid:'u9', name:'Lamia Sultana',     role:'executive', title:'Social Media Lead',  uploads:16, sessions:12, score:400, gradient:'from-fuchsia-500 to-pink-400', initial:'L' },
]

const STATS = [
  { label: 'Total Members',     value: MEMBERS.length },
  { label: 'Total Uploads',     value: MEMBERS.reduce((s, m) => s + m.uploads,  0) },
  { label: 'Total Sessions',    value: MEMBERS.reduce((s, m) => s + m.sessions, 0) },
  { label: 'Avg Activity Score',value: Math.round(MEMBERS.reduce((s, m) => s + m.score, 0) / MEMBERS.length) },
]

const ROLE_STYLE = {
  admin:     'text-amber-muted border-amber-muted/30 bg-amber-muted/10',
  executive: 'text-rose-gold   border-rose-gold/30   bg-rose-gold/10',
  member:    'text-white/40    border-white/15        bg-white/5',
}

function AdminDashboard() {
  const { isAdmin, isLoggedIn } = useAuth()

  // ── Access gate ───────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return <AccessDenied reason="You must be logged in to access the Admin Dashboard." />
  }
  if (!isAdmin) {
    return <AccessDenied reason="This area is restricted to club admins only." />
  }

  return (
    <div className="bg-surface-800 min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-muted/10 border border-amber-muted/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-muted animate-pulse" />
              <span className="font-body text-xs uppercase tracking-wider text-amber-muted">Admin Access</span>
            </div>
            <h1 className="font-display text-5xl font-bold text-white">
              Admin Dashboard
            </h1>
            <p className="font-body text-white/40 mt-2 text-sm">
              Full member overview, roles, and activity data.
            </p>
          </div>

          {/* Quick link to Attendance scanner */}
          <Link
            to="/attendance"
            className="
              flex-shrink-0 flex items-center gap-3 px-6 py-3.5 rounded-2xl
              bg-rose-gold/10 border border-rose-gold/30
              font-body text-sm text-rose-gold
              hover:bg-rose-gold/20 hover:border-rose-gold/50
              transition-all duration-200
            "
          >
            <span className="text-xl">📷</span>
            <div>
              <p className="font-medium">QR Attendance</p>
              <p className="text-xs text-rose-gold/60">Scan member QR codes</p>
            </div>
          </Link>
        </div>

        {/* ── Stats row ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-700 border border-surface-500/30 rounded-2xl p-5 group hover:border-amber-muted/20 transition-all duration-300"
            >
              <p className="font-display text-3xl font-bold text-white group-hover:text-amber-muted transition-colors duration-300">
                {stat.value}
              </p>
              <p className="font-body text-xs text-white/40 mt-1 uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Member table ─────────────────────────────────────────────── */}
        <div className="bg-surface-700 border border-surface-500/30 rounded-2xl overflow-hidden">

          {/* Table header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-500/30">
            <h2 className="font-display text-xl font-semibold text-white">
              All Members
            </h2>
            <span className="font-body text-xs text-white/30">
              {MEMBERS.length} members total
            </span>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-surface-900/40 border-b border-surface-500/20">
            <span className="col-span-4 font-body text-[11px] uppercase tracking-wider text-white/30">Member</span>
            <span className="col-span-2 font-body text-[11px] uppercase tracking-wider text-white/30">Role</span>
            <span className="col-span-2 font-body text-[11px] uppercase tracking-wider text-white/30 text-center">Uploads</span>
            <span className="col-span-2 font-body text-[11px] uppercase tracking-wider text-white/30 text-center">Sessions</span>
            <span className="col-span-2 font-body text-[11px] uppercase tracking-wider text-white/30 text-right">Score</span>
          </div>

          {/* Member rows */}
          {MEMBERS
            .slice()
            .sort((a, b) => b.score - a.score)
            .map((member, index) => (
            <div
              key={member.uid}
              className="
                grid grid-cols-12 gap-2 px-6 py-4 items-center
                border-b border-surface-500/15 last:border-0
                hover:bg-surface-600/40 transition-colors duration-200
                group
              "
            >
              {/* Avatar + name + title */}
              <div className="col-span-4 flex items-center gap-3">
                {/* Rank number */}
                <span className="font-display text-sm text-white/20 w-5 text-right flex-shrink-0">
                  {index + 1}
                </span>
                <div className={`
                  w-9 h-9 rounded-full bg-gradient-to-br ${member.gradient}
                  flex items-center justify-center flex-shrink-0
                  font-display text-sm font-bold text-white
                `}>
                  {member.initial}
                </div>
                <div className="min-w-0">
                  <p className="font-body text-sm font-medium text-white truncate">
                    {member.name}
                  </p>
                  <p className="font-body text-[11px] text-white/30 truncate">
                    {member.title}
                  </p>
                </div>
              </div>

              {/* Role badge */}
              <div className="col-span-2">
                <span className={`inline-block font-body text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${ROLE_STYLE[member.role]}`}>
                  {member.role}
                </span>
              </div>

              {/* Uploads */}
              <div className="col-span-2 text-center">
                <span className="font-body text-sm text-white/70">{member.uploads}</span>
              </div>

              {/* Sessions */}
              <div className="col-span-2 text-center">
                <span className="font-body text-sm text-white/70">{member.sessions}</span>
              </div>

              {/* Score with a subtle bar */}
              <div className="col-span-2 text-right">
                <span className="font-display text-base font-bold text-amber-muted">
                  {member.score}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

// ── Reusable access denied screen ─────────────────────────────────────────────
function AccessDenied({ reason }) {
  return (
    <div className="bg-surface-800 min-h-screen pt-16 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6 text-3xl">
          🚫
        </div>
        <h1 className="font-display text-4xl font-bold text-white mb-3">
          Access Denied
        </h1>
        <p className="font-body text-white/50 leading-relaxed mb-8">{reason}</p>
        <Link
          to="/"
          className="font-body text-sm text-rose-gold hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard
