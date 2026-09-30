// pages/CreativeHub.jsx
//
// The public gallery — anyone can browse.
// Three parts:
//   1. Page header (title + description)
//   2. Filter tabs: All / Photography / Art
//   3. Masonry-style image grid

import { useState } from 'react'
import { Link }     from 'react-router-dom'
import useAuth      from '../hooks/useAuth'

// ── Sample posts (replace with Firestore data later) ─────────────────────────
import portraitImg      from '../assets/sample_portrait.jpg'
import abstractImg      from '../assets/sample_abstract_art.jpg'
import streetImg        from '../assets/sample_street_photo.jpg'
import illustrationImg  from '../assets/sample_illustration.jpg'
import architectureImg  from '../assets/sample_architecture.jpg'

const POSTS = [
  {
    id: 1,
    category:   'photo',
    image:       portraitImg,
    caption:     'Quiet Resolve',
    authorName:  'Nadia Islam',
    authorUid:   'user_001',
    createdAt:   'July 28, 2026',
  },
  {
    id: 2,
    category:   'art',
    image:       abstractImg,
    caption:     'Liquid Cosmos',
    authorName:  'Rafid Hasan',
    authorUid:   'user_002',
    createdAt:   'July 25, 2026',
  },
  {
    id: 3,
    category:   'photo',
    image:       streetImg,
    caption:     'Dhaka After Rain',
    authorName:  'Sadia Akter',
    authorUid:   'user_003',
    createdAt:   'July 22, 2026',
  },
  {
    id: 4,
    category:   'art',
    image:       illustrationImg,
    caption:     'The Wanderer',
    authorName:  'Omar Faruk',
    authorUid:   'user_004',
    createdAt:   'July 19, 2026',
  },
  {
    id: 5,
    category:   'photo',
    image:       architectureImg,
    caption:     'Golden Symmetry',
    authorName:  'Tasnim Chowdhury',
    authorUid:   'user_005',
    createdAt:   'July 15, 2026',
  },
]

// The 3 filter tabs
const TABS = [
  { key: 'all',   label: 'All Works'    },
  { key: 'photo', label: 'Photography'  },
  { key: 'art',   label: 'Art'          },
]

// Badge colour per category
const CATEGORY_STYLE = {
  photo: 'text-sky-400  border-sky-400/30  bg-sky-400/10',
  art:   'text-rose-gold border-rose-gold/30 bg-rose-gold/10',
}

// ── Component ────────────────────────────────────────────────────────────────
function CreativeHub() {
  // Which tab is selected — 'all', 'photo', or 'art'
  const [activeTab, setActiveTab] = useState('all')

  // Get auth state — we'll show an Upload button if logged in
  const { isLoggedIn } = useAuth()

  // Filter the posts array based on the active tab
  // If 'all' is selected, show everything. Otherwise only matching category.
  const filteredPosts = activeTab === 'all'
    ? POSTS
    : POSTS.filter((p) => p.category === activeTab)

  return (
    <div className="bg-surface-800 min-h-screen">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      {/* pt-16 pushes content below the fixed navbar (which is h-16) */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.3em] text-rose-gold mb-3">
              Our Work
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight">
              Creative Hub
            </h1>
            <p className="font-body text-white/50 mt-3 max-w-lg leading-relaxed">
              A living gallery of art and photography created by our members.
              Explore, get inspired, and follow the creators.
            </p>
          </div>

          {/* Upload button — only visible when logged in */}
          {isLoggedIn && (
            <button className="
              flex-shrink-0 px-6 py-3 rounded-full font-body text-sm font-medium
              bg-rose-gold text-white tracking-wide
              hover:bg-rose-gold-dark hover:shadow-lg hover:shadow-rose-gold/30
              transition-all duration-300 hover:-translate-y-0.5
            ">
              + Upload Work
            </button>
          )}
        </div>
      </div>

      {/* ── Filter tabs ─────────────────────────────────────────────────── */}
      <div className="border-b border-surface-500/30 sticky top-16 z-40 bg-surface-800/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {TABS.map((tab) => (
              // Each tab is a button. Clicking it updates activeTab state.
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  relative py-4 font-body text-sm tracking-wide
                  transition-colors duration-200
                  ${activeTab === tab.key
                    ? 'text-rose-gold'
                    : 'text-white/40 hover:text-white/70'
                  }
                `}
              >
                {tab.label}
                {/* Active tab underline indicator */}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-rose-gold rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Gallery grid ────────────────────────────────────────────────── */}
      {/* 
        CSS columns layout = masonry effect for free.
        Images stack naturally and fill vertical space,
        like Pinterest-style layout.
      */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {filteredPosts.length === 0 ? (
          // Empty state — shown when filter returns nothing
          <div className="text-center py-24">
            <p className="font-display text-2xl text-white/20">
              No works in this category yet.
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── PostCard sub-component ───────────────────────────────────────────────────
// A single gallery card. Extracted into its own function to keep things clean.
// It receives a "post" object as a prop (a piece of data passed in from the parent).
//
// WHAT IS A PROP?
// Think of a component like a recipe card. A prop is an ingredient you hand to it.
// The parent (CreativeHub) prepares the data; PostCard just displays it.

function PostCard({ post }) {
  // Track hover state to show/hide the overlay
  const [hovered, setHovered] = useState(false)

  return (
    // break-inside-avoid stops the card from splitting across columns
    <div
      className="break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* The artwork image */}
      <img
        src={post.image}
        alt={post.caption}
        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Hover overlay — slides up from the bottom */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent
          flex flex-col justify-end p-5
          transition-opacity duration-300
          ${hovered ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {/* Category badge */}
        <span className={`
          inline-block self-start font-body text-[10px] uppercase tracking-wider
          px-2.5 py-1 rounded-full border mb-2
          ${CATEGORY_STYLE[post.category]}
        `}>
          {post.category === 'photo' ? 'Photography' : 'Art'}
        </span>

        {/* Caption */}
        <h3 className="font-display text-xl font-semibold text-white mb-1">
          {post.caption}
        </h3>

        {/* Author link — clicking goes to their member profile */}
        <Link
          to={`/members`}
          className="font-body text-sm text-white/60 hover:text-rose-gold transition-colors duration-200"
          onClick={(e) => e.stopPropagation()} // prevent double-firing
        >
          by {post.authorName}
        </Link>

        {/* Date */}
        <p className="font-body text-[11px] text-white/30 mt-1">
          {post.createdAt}
        </p>
      </div>
    </div>
  )
}

export default CreativeHub
