// pages/Login.jsx
//
// The login page. Split-screen layout:
//   - LEFT PANEL  (desktop only): decorative branding side
//   - RIGHT PANEL: the actual login form
//
// What this page does:
//   1. Tracks email, password, error, and loading state
//   2. On submit → calls Firebase login
//   3. On success → redirects to home
//   4. On failure → shows a friendly error message
//   5. If user is ALREADY logged in → redirects immediately

import { useState, useEffect } from 'react'
import { Link, useNavigate }   from 'react-router-dom'
import useAuth                 from '../hooks/useAuth'
import { loginWithEmail, getAuthErrorMessage, resetPassword } from '../firebase/auth'

function Login() {
  // Form field values
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')

  // UI state
  const [showPassword, setShowPassword] = useState(false)   // toggle eye
  const [loading,      setLoading]      = useState(false)   // spinner state
  const [error,        setError]        = useState('')      // error message
  const [resetSent,    setResetSent]    = useState(false)   // password reset confirmation

  // Get login status and navigation
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  // If already logged in, kick them back to home immediately
  // useEffect runs AFTER render. We watch [isLoggedIn] — if it becomes
  // true (login just succeeded), this fires and redirects.
  useEffect(() => {
    if (isLoggedIn) navigate('/')
  }, [isLoggedIn, navigate])

  // ── Handle the login form submit ──────────────────────────────────────────
  const handleLogin = async (e) => {
    // e.preventDefault() stops the browser from refreshing the page
    // (the default behaviour when a form is submitted)
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await loginWithEmail(email, password)
      // If we reach here, login worked.
      // AuthContext's onAuthStateChanged will fire → isLoggedIn becomes true
      // → useEffect above redirects to '/'
    } catch (err) {
      // err.code is Firebase's error identifier e.g. 'auth/wrong-password'
      setError(getAuthErrorMessage(err.code))
    } finally {
      // Always runs — whether login succeeded or failed
      setLoading(false)
    }
  }

  // ── Handle "Forgot password?" ──────────────────────────────────────────────
  const handleResetPassword = async () => {
    if (!email) {
      setError('Enter your email address above first, then click Forgot Password.')
      return
    }
    try {
      await resetPassword(email)
      setResetSent(true)
      setError('')
    } catch (err) {
      setError(getAuthErrorMessage(err.code))
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    // Full-screen flex container — row on desktop, column on mobile
    <div className="min-h-screen flex">

      {/* ══════════════════════════════════════════════
          LEFT PANEL — Decorative branding (desktop only)
          hidden on mobile (hidden), shown on large screens (lg:flex)
      ══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-900 flex-col items-center justify-center p-16">

        {/* Background gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-rose-gold/10 blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-amber-muted/8 blur-3xl animate-float delay-300 pointer-events-none" />

        {/* Decorative grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(#c9956a 1px, transparent 1px), linear-gradient(90deg, #c9956a 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <span className="w-1 h-10 bg-rose-gold rounded-full" />
            <div className="text-left">
              <p className="font-display text-2xl font-bold text-white">BUAPS</p>
              <p className="text-[11px] text-white/30 uppercase tracking-widest">Art &amp; Photography</p>
            </div>
          </div>

          {/* Large decorative heading */}
          <h2 className="font-display text-5xl font-bold text-white leading-tight mb-6">
            Your creative
            <span className="block italic text-rose-gold">world awaits.</span>
          </h2>

          <p className="font-body text-white/40 leading-relaxed mb-12">
            Sign in to upload your work, track your activity, and connect
            with fellow visual artists at BRAC University.
          </p>

          {/* Decorative divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-surface-500/40" />
            <span className="font-display text-rose-gold/40 text-2xl italic">"</span>
            <div className="flex-1 h-px bg-surface-500/40" />
          </div>

          <p className="font-display text-lg italic text-white/30 mt-6 leading-relaxed">
            Photography is the story I fail to put into words.
          </p>
          <p className="font-body text-xs text-white/20 mt-3">— Destin Sparks</p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          RIGHT PANEL — Login form
      ══════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center bg-surface-800 px-6 py-20">
        <div className="w-full max-w-md">

          {/* Mobile-only logo (hidden on desktop since the left panel shows it) */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <span className="w-1 h-7 bg-rose-gold rounded-full" />
            <p className="font-display text-xl font-bold text-white">BUAPS</p>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            Welcome back
          </h1>
          <p className="font-body text-sm text-white/40 mb-10">
            Sign in to your BUAPS member account
          </p>

          {/* ── The login form ─────────────────────────────────────── */}
          {/*
            onSubmit calls handleLogin when the user presses Enter
            or clicks the Sign In button. e.preventDefault() inside
            handleLogin prevents the default page-refresh behavior.
          */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email field */}
            <div>
              <label className="font-body text-xs uppercase tracking-widest text-white/40 mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                id="login-email"
                required
                placeholder="you@bracu.ac.bd"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full px-4 py-3.5 rounded-xl
                  bg-surface-700 border border-surface-500/40
                  font-body text-sm text-white placeholder-white/25
                  focus:outline-none focus:border-rose-gold/60
                  transition-colors duration-200
                "
              />
            </div>

            {/* Password field with show/hide toggle */}
            <div>
              <label className="font-body text-xs uppercase tracking-widest text-white/40 mb-2 block">
                Password
              </label>
              {/* Relative container so the toggle button can be positioned inside */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full px-4 py-3.5 pr-16 rounded-xl
                    bg-surface-700 border border-surface-500/40
                    font-body text-sm text-white placeholder-white/25
                    focus:outline-none focus:border-rose-gold/60
                    transition-colors duration-200
                  "
                />
                {/* Show / Hide toggle button sits inside the input on the right */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-xs text-white/30 hover:text-white/70 transition-colors duration-200"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Error message — only shows when `error` is not empty */}
            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <span className="text-red-400 text-sm mt-0.5">⚠</span>
                <p className="font-body text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Password reset confirmation */}
            {resetSent && (
              <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                <span className="text-emerald-400 text-sm mt-0.5">✓</span>
                <p className="font-body text-sm text-emerald-400">
                  Reset link sent! Check your email inbox.
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="
                w-full py-3.5 rounded-xl font-body font-medium tracking-wide
                bg-rose-gold text-white
                transition-all duration-300
                hover:bg-rose-gold-dark hover:shadow-lg hover:shadow-rose-gold/30
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              "
            >
              {/* Show spinner text while loading */}
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Forgot password link */}
          <div className="mt-5 text-center">
            <button
              onClick={handleResetPassword}
              className="font-body text-sm text-white/30 hover:text-rose-gold transition-colors duration-200"
            >
              Forgot your password?
            </button>
          </div>

          {/* Back to site link */}
          <div className="mt-10 pt-6 border-t border-surface-500/20 text-center">
            <Link
              to="/"
              className="font-body text-sm text-white/30 hover:text-white transition-colors duration-200 inline-flex items-center gap-2"
            >
              <span>←</span> Back to website
            </Link>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Login
