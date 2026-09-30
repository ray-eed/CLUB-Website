// components/Footer.jsx
//
// The footer appears at the bottom of every page.
// Three columns: club info | quick links | connect
// Then a thin bottom bar with copyright.

import { Link } from 'react-router-dom'

const QUICK_LINKS = [
  { label: 'Home',        path: '/'             },
  { label: 'Achievements',path: '/achievements'  },
  { label: 'Creative Hub',path: '/creative-hub'  },
  { label: 'Members',     path: '/members'       },
]

function Footer() {
  return (
    <footer className="bg-surface-900 border-t border-surface-500/20">

      {/* Main 3-column grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* ── Column 1: Club identity ─────────────────────── */}
        <div>
          {/* Logo mark */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-1 h-8 bg-rose-gold rounded-full" />
            <div>
              <p className="font-display text-lg font-bold text-white">BUAPS</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Art &amp; Photography</p>
            </div>
          </div>
          <p className="font-body text-sm text-white/40 leading-relaxed max-w-xs">
            The creative heart of Brac University. A space for visual artists,
            photographers, and storytellers to share their work with the world.
          </p>
        </div>

        {/* ── Column 2: Quick links ───────────────────────── */}
        <div>
          <h4 className="font-body text-xs uppercase tracking-[0.25em] text-rose-gold mb-6">
            Explore
          </h4>
          <ul className="space-y-3">
            {QUICK_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="font-body text-sm text-white/50 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Column 3: Connect ───────────────────────────── */}
        <div>
          <h4 className="font-body text-xs uppercase tracking-[0.25em] text-rose-gold mb-6">
            Connect
          </h4>
          <ul className="space-y-3">
            {[
              { label: 'Instagram',  href: '#' },
              { label: 'Facebook',   href: '#' },
              { label: 'LinkedIn',   href: '#' },
              { label: 'Contact Us', href: '#' },
            ].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="font-body text-sm text-white/50 hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group"
                >
                  {item.label}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-rose-gold">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom copyright bar */}
      <div className="border-t border-surface-500/20 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs text-white/20">
            © 2026 Brac University Art and Photography Society (BUAPS). All rights reserved.
          </p>
          <p className="font-body text-xs text-white/20">
            Built with ♥ by BUAPS
          </p>
        </div>
      </div>

    </footer>
  )
}

export default Footer
