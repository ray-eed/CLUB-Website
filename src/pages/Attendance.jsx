// pages/Attendance.jsx
//
// Admin-only QR attendance system.
//
// HOW IT WORKS:
//   1. Admin opens this page — camera activates
//   2. Member shows their QR code (from Profile page)
//   3. Admin points camera at it → scanner reads the uid
//   4. System checks Firestore: is this member currently checked in?
//      - NO  → logs a check-in with current timestamp
//      - YES → logs a check-out, calculates session duration in minutes
//   5. Result is displayed on screen + added to History list
//
// Also has a MANUAL ENTRY mode (type UID) for testing without a camera.

import { useState, useEffect, useRef } from 'react'
import { Link }                         from 'react-router-dom'
import useAuth                          from '../hooks/useAuth'
import {
  getActiveSession,
  logCheckIn,
  logCheckOut,
  getRecentSessions,
} from '../firebase/firestore'

// ── Placeholder members (for name lookup without full Firestore) ─────────────
// In production, you'd call getUserProfile(uid) to look up the name.
const MOCK_MEMBERS = {
  'u1': 'Nadia Islam',    'u2': 'Rafid Hasan',
  'u3': 'Sadia Akter',   'u4': 'Omar Faruk',
  'u5': 'Tasnim Chowdhury','u6': 'Mahir Rahman',
  'u7': 'Rina Begum',    'u8': 'Farhan Kabir',
  'u9': 'Lamia Sultana',
}

// ── Helper: format a JS timestamp to a readable time string ─────────────────
function formatTime(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function Attendance() {
  const { isAdmin, isLoggedIn } = useAuth()

  // ── Which tab is active: 'scan' or 'history' ─────────────────────────────
  const [activeTab, setActiveTab] = useState('scan')

  // ── Scanner state ─────────────────────────────────────────────────────────
  const [scanning,   setScanning]   = useState(false)   // camera running?
  const [manualUid,  setManualUid]  = useState('')      // manual entry field
  const [processing, setProcessing] = useState(false)   // waiting for Firestore?

  // ── Last scan result ──────────────────────────────────────────────────────
  // null = no scan yet. Object = { type: 'in'|'out', name, duration? }
  const [lastResult, setLastResult] = useState(null)

  // ── Recent sessions list ──────────────────────────────────────────────────
  const [sessions, setSessions] = useState([])
  const [loadingSessions, setLoadingSessions] = useState(false)

  // Ref to the div where html5-qrcode will mount its camera UI
  const scannerDivId = 'qr-scanner-mount'
  const scannerRef   = useRef(null)   // holds the Html5QrcodeScanner instance

  // ── Fetch history when History tab opens ──────────────────────────────────
  useEffect(() => {
    if (activeTab === 'history') {
      setLoadingSessions(true)
      getRecentSessions(30)
        .then(setSessions)
        .catch(() => setSessions([]))
        .finally(() => setLoadingSessions(false))
    }
  }, [activeTab])

  // ── Start the camera scanner ──────────────────────────────────────────────
  const startScanner = async () => {
    // Dynamically import html5-qrcode to avoid SSR issues
    const { Html5QrcodeScanner } = await import('html5-qrcode')

    setScanning(true)
    setLastResult(null)

    const scanner = new Html5QrcodeScanner(
      scannerDivId,
      {
        fps: 10,           // check 10 frames per second
        qrbox: { width: 250, height: 250 }, // scanning window size
        aspectRatio: 1.0,
      },
      /* verbose= */ false,
    )

    scanner.render(
      // onSuccess: fires when a QR code is detected
      async (decodedText) => {
        scanner.clear().catch(() => {})
        setScanning(false)
        await processUid(decodedText.trim())
      },
      // onError: fires on every failed frame — we ignore these
      () => {},
    )

    scannerRef.current = scanner
  }

  // ── Stop the scanner cleanly ──────────────────────────────────────────────
  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {})
      scannerRef.current = null
    }
    setScanning(false)
  }

  // Cleanup on unmount — don't leave camera running if user navigates away
  useEffect(() => {
    return () => stopScanner()
  }, [])

  // ── Core logic: handle a scanned or manually entered UID ──────────────────
  const processUid = async (uid) => {
    if (!uid || processing) return
    setProcessing(true)
    setLastResult(null)

    const memberName = MOCK_MEMBERS[uid] ?? `Member (${uid.slice(0,8)})`

    try {
      // Check if this member is currently checked in
      const activeSession = await getActiveSession(uid)

      if (!activeSession) {
        // ── Not checked in → LOG CHECK-IN ──────────────────────────────
        await logCheckIn(uid, memberName)
        setLastResult({ type: 'in', name: memberName, time: new Date() })
      } else {
        // ── Already checked in → LOG CHECK-OUT ─────────────────────────
        // Calculate duration from checkIn timestamp
        const checkInMillis = activeSession.checkIn?.toMillis
          ? activeSession.checkIn.toMillis()
          : Date.now() - 60000 // fallback: 1 min ago
        await logCheckOut(activeSession.sessionId, checkInMillis)
        const durationMins = Math.round((Date.now() - checkInMillis) / 60000)
        setLastResult({ type: 'out', name: memberName, duration: durationMins })
      }
    } catch (err) {
      // Firebase not configured yet → show a demo result
      setLastResult({ type: 'demo', name: memberName, uid })
    } finally {
      setProcessing(false)
      setManualUid('')
    }
  }

  // ── Handle manual entry submit ────────────────────────────────────────────
  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (manualUid.trim()) processUid(manualUid.trim())
  }

  // ── Access gates ──────────────────────────────────────────────────────────
  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="bg-surface-800 min-h-screen pt-16 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6 text-3xl">🚫</div>
          <h1 className="font-display text-4xl font-bold text-white mb-3">Admin Only</h1>
          <p className="font-body text-white/50 mb-8">The attendance system is restricted to club administrators.</p>
          <Link to="/" className="font-body text-sm text-rose-gold hover:underline">← Back to Home</Link>
        </div>
      </div>
    )
  }

  // ── Main UI ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-surface-800 min-h-screen pt-16">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/admin" className="font-body text-sm text-white/30 hover:text-white transition-colors">
              ← Dashboard
            </Link>
          </div>
          <p className="font-body text-xs uppercase tracking-[0.3em] text-rose-gold mb-2">Admin Tool</p>
          <h1 className="font-display text-5xl font-bold text-white">
            QR Attendance
          </h1>
          <p className="font-body text-white/40 text-sm mt-2">
            Scan a member's QR code to log check-in or check-out.
          </p>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <div className="flex gap-6 border-b border-surface-500/30 mb-8">
          {['scan', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); if (tab !== 'scan') stopScanner() }}
              className={`
                pb-3 font-body text-sm capitalize tracking-wide relative
                transition-colors duration-200
                ${activeTab === tab ? 'text-rose-gold' : 'text-white/40 hover:text-white/70'}
              `}
            >
              {tab === 'scan' ? '📷 Scanner' : '📋 History'}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-rose-gold rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════
            SCAN TAB
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'scan' && (
          <div className="space-y-6">

            {/* ── Camera scanner area ──────────────────────────────── */}
            <div className="bg-surface-700 border border-surface-500/30 rounded-2xl p-6">
              <h2 className="font-display text-lg font-semibold text-white mb-4">
                Camera Scanner
              </h2>

              {!scanning ? (
                <div className="text-center py-10">
                  {/* Decorative camera icon */}
                  <div className="w-20 h-20 rounded-full bg-rose-gold/10 border border-rose-gold/20 flex items-center justify-center mx-auto mb-5 text-4xl">
                    📷
                  </div>
                  <p className="font-body text-sm text-white/50 mb-6 max-w-xs mx-auto leading-relaxed">
                    Click the button below to activate the camera and scan a member's QR code.
                  </p>
                  <button
                    onClick={startScanner}
                    className="
                      px-8 py-3.5 rounded-full font-body font-medium
                      bg-rose-gold text-white tracking-wide
                      hover:bg-rose-gold-dark hover:shadow-lg hover:shadow-rose-gold/30
                      transition-all duration-300
                    "
                  >
                    Start Scanner
                  </button>
                </div>
              ) : (
                <div>
                  {/* html5-qrcode mounts its camera UI here */}
                  <div
                    id={scannerDivId}
                    className="rounded-xl overflow-hidden"
                  />
                  <button
                    onClick={stopScanner}
                    className="mt-4 w-full py-2.5 rounded-xl font-body text-sm border border-surface-500/40 text-white/50 hover:text-white hover:border-white/30 transition-all duration-200"
                  >
                    Stop Scanner
                  </button>
                </div>
              )}
            </div>

            {/* ── Manual entry (for testing without camera) ─────────── */}
            <div className="bg-surface-700 border border-surface-500/30 rounded-2xl p-6">
              <h2 className="font-display text-lg font-semibold text-white mb-1">
                Manual Entry
              </h2>
              <p className="font-body text-xs text-white/30 mb-4">
                Type a member UID directly — useful for testing before Firebase is connected.
                Try: u1, u2, u3 … u9
              </p>
              <form onSubmit={handleManualSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={manualUid}
                  onChange={(e) => setManualUid(e.target.value)}
                  placeholder="Enter member UID (e.g. u1)"
                  className="
                    flex-1 px-4 py-3 rounded-xl
                    bg-surface-600 border border-surface-500/40
                    font-body text-sm text-white placeholder-white/25
                    focus:outline-none focus:border-rose-gold/50
                    transition-colors duration-200
                  "
                />
                <button
                  type="submit"
                  disabled={processing || !manualUid.trim()}
                  className="
                    px-5 py-3 rounded-xl font-body text-sm font-medium
                    bg-rose-gold text-white
                    hover:bg-rose-gold-dark transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {processing ? '…' : 'Process'}
                </button>
              </form>
            </div>

            {/* ── Result card ──────────────────────────────────────── */}
            {lastResult && (
              <div className={`
                rounded-2xl border p-6
                ${lastResult.type === 'in'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : lastResult.type === 'out'
                  ? 'bg-sky-500/10 border-sky-500/30'
                  : 'bg-amber-muted/10 border-amber-muted/30'
                }
              `}>
                {/* Big emoji status */}
                <div className="text-4xl mb-3">
                  {lastResult.type === 'in'  ? '✅' :
                   lastResult.type === 'out' ? '🏁' : '🔍'}
                </div>

                <h3 className="font-display text-2xl font-semibold text-white mb-1">
                  {lastResult.name}
                </h3>

                {lastResult.type === 'in' && (
                  <p className="font-body text-emerald-400 text-base">
                    ✓ Checked <strong>IN</strong> at {lastResult.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
                {lastResult.type === 'out' && (
                  <div>
                    <p className="font-body text-sky-400 text-base">
                      ✓ Checked <strong>OUT</strong>
                    </p>
                    <p className="font-body text-white/60 text-sm mt-1">
                      Session duration: <span className="text-white font-medium">{lastResult.duration} minutes</span>
                    </p>
                  </div>
                )}
                {lastResult.type === 'demo' && (
                  <div>
                    <p className="font-body text-amber-muted text-sm">
                      Demo mode — Firebase not connected yet.
                    </p>
                    <p className="font-body text-white/40 text-xs mt-1 font-mono">
                      UID: {lastResult.uid}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            HISTORY TAB
        ════════════════════════════════════════════════════════════ */}
        {activeTab === 'history' && (
          <div>
            {loadingSessions ? (
              <p className="font-body text-white/30 text-center py-12 animate-pulse">
                Loading sessions…
              </p>
            ) : sessions.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-display text-2xl text-white/20 mb-2">No sessions yet</p>
                <p className="font-body text-sm text-white/30">
                  Attendance sessions will appear here once Firebase is connected and QR codes are scanned.
                </p>
              </div>
            ) : (
              <div className="bg-surface-700 border border-surface-500/30 rounded-2xl overflow-hidden">
                {/* Column headers */}
                <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-surface-900/40 border-b border-surface-500/20">
                  <span className="col-span-3 font-body text-[11px] uppercase tracking-wider text-white/30">Member</span>
                  <span className="col-span-3 font-body text-[11px] uppercase tracking-wider text-white/30">Check In</span>
                  <span className="col-span-3 font-body text-[11px] uppercase tracking-wider text-white/30">Check Out</span>
                  <span className="col-span-3 font-body text-[11px] uppercase tracking-wider text-white/30 text-right">Duration</span>
                </div>

                {sessions.map((s) => (
                  <div
                    key={s.sessionId}
                    className="grid grid-cols-12 gap-2 px-6 py-4 items-center border-b border-surface-500/15 last:border-0 hover:bg-surface-600/30 transition-colors duration-200"
                  >
                    <div className="col-span-3">
                      <p className="font-body text-sm text-white">{s.memberName}</p>
                    </div>
                    <div className="col-span-3">
                      <p className="font-body text-sm text-emerald-400">{formatTime(s.checkIn)}</p>
                    </div>
                    <div className="col-span-3">
                      {s.checkOut ? (
                        <p className="font-body text-sm text-sky-400">{formatTime(s.checkOut)}</p>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-body text-xs text-amber-muted">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-muted animate-pulse" />
                          Active
                        </span>
                      )}
                    </div>
                    <div className="col-span-3 text-right">
                      {s.duration != null ? (
                        <span className="font-body text-sm text-white/70">{s.duration} min</span>
                      ) : (
                        <span className="font-body text-xs text-white/20">—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default Attendance
