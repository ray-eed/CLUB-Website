// components/Navbar.jsx
//
// This is the navigation bar that appears at the top of every page.
// It does three things:
//   1. Shows the club logo/name
//   2. Shows nav links (and highlights the active one)
//   3. Shows a Login button — or the user's name if they're already logged in

import { useState, useEffect } from 'react'
import { Link, useLocation }   from 'react-router-dom'
import useAuth                 from '../hooks/useAuth'
import { logoutUser }          from '../firebase/auth'

// All the public nav links — we'll add member-only links conditionally below
const NAV_LINKS = [
  { label: 'Home',        path: '/'             },
  { label: 'Achievements',path: '/achievements'  },
  { label: 'Creative Hub',path: '/creative-hub'  },
  { label: 'Members',     path: '/members'       },
]

function Navbar() {
  // Controls whether the mobile menu is open or closed
  const [menuOpen, setMenuOpen] = useState(false)

  // Controls when the navbar becomes "solid" on scroll
  const [scrolled, setScrolled] = useState(false)

  // Get login state from our AuthContext (via the useAuth shortcut)
  const { isLoggedIn, isAdmin, userProfile } = useAuth()

  // useLocation tells us what the current URL path is
  // We use this to highlight the active nav link
  const location = useLocation()

  // Listen for scroll events — when user scrolls down 20px,
  // activate the frosted-glass background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu whenever the page changes
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Helper: is this link the currently active page?
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    // The <nav> wraps everything. It's fixed to the top of the screen.
    // When scrolled, we add a frosted-glass dark background.
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-in-out
        ${scrolled
          ? 'bg-surface-800/90 backdrop-blur-md border-b border-surface-500/30 shadow-xl shadow-black/30'
          : 'bg-transparent'
        }
      `}
    >
      {/* Inner container: limits max width and adds horizontal padding */}
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ── LEFT: Club wordmark ───────────────────────────────── */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* Decorative accent bar */}
          <span className="w-1 h-8 bg-rose-gold rounded-full transition-all duration-300 group-hover:h-10" />
          <div className="leading-tight">
            {/* Main club acronym in serif display font */}
            <span className="font-display text-xl font-bold text-white tracking-wide">
              BUAPS
            </span>
            {/* Subtitle — smaller, muted */}
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-body -mt-0.5">
              Art &amp; Photography
            </p>
          </div>
        </Link>

        {/* ── CENTER: Desktop nav links ─────────────────────────── */}
        {/* hidden on mobile (hidden), visible on medium screens (md:flex) */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`
                  relative font-body text-sm tracking-wide
                  transition-colors duration-200
                  ${isActive(link.path)
                    ? 'text-rose-gold'
                    : 'text-white/60 hover:text-white'
                  }
                  after:absolute after:bottom-[-4px] after:left-0
                  after:h-[1.5px] after:bg-rose-gold after:rounded-full
                  after:transition-all after:duration-300
                  ${isActive(link.path) ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
                `}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Show Leaderboard link only if logged in */}
          {isLoggedIn && (
            <li>
              <Link
                to="/leaderboard"
                className={`
                  relative font-body text-sm tracking-wide
                  transition-colors duration-200
                  ${isActive('/leaderboard')
                    ? 'text-rose-gold'
                    : 'text-white/60 hover:text-white'
                  }
                  after:absolute after:bottom-[-4px] after:left-0
                  after:h-[1.5px] after:bg-rose-gold after:rounded-full
                  after:transition-all after:duration-300
                  ${isActive('/leaderboard') ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
                `}
              >
                Leaderboard
              </Link>
            </li>
          )}

          {/* Show Admin link only for admins */}
          {isAdmin && (
            <li>
              <Link
                to="/admin"
                className={`
                  relative font-body text-sm tracking-wide
                  transition-colors duration-200
                  ${isActive('/admin')
                    ? 'text-amber-muted'
                    : 'text-amber-muted/60 hover:text-amber-muted'
                  }
                  after:absolute after:bottom-[-4px] after:left-0
                  after:h-[1.5px] after:bg-amber-muted after:rounded-full
                  after:transition-all after:duration-300
                  ${isActive('/admin') ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
                `}
              >
                Admin
              </Link>
            </li>
          )}
        </ul>

        {/* ── RIGHT: Auth button ────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            // Logged in → show profile link with user's name + logout
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="flex items-center gap-2 group"
              >
                {/* Avatar circle with user's first initial */}
                <div className="w-8 h-8 rounded-full bg-rose-gold/20 border border-rose-gold/50 flex items-center justify-center transition-all duration-200 group-hover:border-rose-gold">
                  <span className="font-display text-rose-gold text-sm font-semibold">
                    {userProfile?.name?.[0]?.toUpperCase() ?? '?'}
                  </span>
                </div>
                <span className="font-body text-sm text-white/70 group-hover:text-white transition-colors duration-200">
                  {userProfile?.name ?? 'Profile'}
                </span>
              </Link>
              {/* Logout button */}
              <button
                onClick={() => logoutUser()}
                className="font-body text-xs text-white/30 hover:text-red-400 transition-colors duration-200"
              >
                Sign out
              </button>
            </div>
          ) : (
            // Not logged in → show Login button
            <Link
              to="/login"
              className="
                px-5 py-2 rounded-full font-body text-sm tracking-wide
                border border-rose-gold/50 text-rose-gold
                transition-all duration-300
                hover:bg-rose-gold hover:text-white hover:border-rose-gold
                hover:shadow-lg hover:shadow-rose-gold/20
              "
            >
              Login
            </Link>
          )}
        </div>

        {/* ── MOBILE: Hamburger button ──────────────────────────── */}
        {/* Only visible on small screens */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 group"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {/* Three lines that animate into an X when open */}
          <span className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* ── MOBILE: Dropdown menu ─────────────────────────────────── */}
      {/* Slides down when menuOpen is true */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-in-out
          bg-surface-800/95 backdrop-blur-md border-t border-surface-500/20
          ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <ul className="flex flex-col px-6 py-4 gap-4">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`font-body text-sm tracking-wide transition-colors duration-200 ${isActive(link.path) ? 'text-rose-gold' : 'text-white/70 hover:text-white'}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {isLoggedIn && (
            <li>
              <Link to="/leaderboard" className="font-body text-sm text-white/70 hover:text-white transition-colors duration-200">
                Leaderboard
              </Link>
            </li>
          )}
          {isAdmin && (
            <li>
              <Link to="/admin" className="font-body text-sm text-amber-muted hover:text-amber-muted/80 transition-colors duration-200">
                Admin
              </Link>
            </li>
          )}
          {/* Login / Profile in mobile menu */}
          <li className="pt-2 border-t border-surface-500/30">
            {isLoggedIn ? (
              <Link to="/profile" className="font-body text-sm text-rose-gold">
                My Profile
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-block px-5 py-2 rounded-full border border-rose-gold/50 text-rose-gold font-body text-sm hover:bg-rose-gold hover:text-white transition-all duration-300"
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
