// pages/Profile.jsx
//
// The logged-in member's own editable profile page.
//
// Two modes:
//   VIEW mode  — shows name, bio, role, socials, uploaded works
//   EDIT mode  — shows input fields the user can change, then save
//
// If the user is NOT logged in, we redirect them to /login.

import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import useAuth                 from '../hooks/useAuth'
import { updateUserProfile }   from '../firebase/firestore'
import QRCodeDisplay           from '../components/QRCodeDisplay'

// Placeholder works — will come from Firestore later
import portraitImg     from '../assets/sample_portrait.jpg'
import abstractImg     from '../assets/sample_abstract_art.jpg'
import streetImg       from '../assets/sample_street_photo.jpg'

const SAMPLE_WORKS = [
  { id: 1, image: portraitImg,  caption: 'Quiet Resolve',   category: 'photo' },
  { id: 2, image: abstractImg,  caption: 'Liquid Cosmos',   category: 'art'   },
  { id: 3, image: streetImg,    caption: 'Dhaka After Rain', category: 'photo' },
]

const CATEGORY_STYLE = {
  photo: 'text-sky-400   border-sky-400/30   bg-sky-400/10',
  art:   'text-rose-gold border-rose-gold/30 bg-rose-gold/10',
}

const ROLE_LABEL = {
  admin:     '⭐ Admin',
  executive: '🔷 Executive',
  member:    '● Member',
}

function Profile() {
  const { currentUser, userProfile, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  // ── Redirect if not logged in ─────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn, navigate])

  // ── Edit mode toggle ──────────────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false)

  // ── Form state — initialised from userProfile ─────────────────────────────
  // We keep a local copy of the profile fields so we can edit them freely
  // without changing the actual userProfile until the user hits "Save".
  const [form, setForm] = useState({
    name:              '',
    bio:               '',
    instagram:         '',
    linkedin:          '',
    facebook:          '',
    website:           '',
  })

  // When userProfile loads (it's async), populate the form
  useEffect(() => {
    if (userProfile) {
      setForm({
        name:      userProfile.name      ?? '',
        bio:       userProfile.bio       ?? '',
        instagram: userProfile.socials?.instagram ?? '',
        linkedin:  userProfile.socials?.linkedin  ?? '',
        facebook:  userProfile.socials?.facebook  ?? '',
        website:   userProfile.socials?.website   ?? '',
      })
    }
  }, [userProfile])

  // ── Save state ────────────────────────────────────────────────────────────
  const [saving,    setSaving]    = useState(false)
  const [saveMsg,   setSaveMsg]   = useState('')   // success/error toast

  // ── Handle input changes ──────────────────────────────────────────────────
  // One handler for all fields — `field` is the key, `value` is what was typed
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // ── Save profile to Firestore ─────────────────────────────────────────────
  const handleSave = async () => {
    if (!currentUser) return
    setSaving(true)
    setSaveMsg('')
    try {
      await updateUserProfile(currentUser.uid, {
        name: form.name,
        bio:  form.bio,
        socials: {
          instagram: form.instagram,
          linkedin:  form.linkedin,
          facebook:  form.facebook,
          website:   form.website,
        },
      })
      setSaveMsg('Profile saved!')
      setIsEditing(false)
    } catch (err) {
      setSaveMsg('Could not save. Check Firebase credentials.')
    } finally {
      setSaving(false)
      // Clear the message after 3 seconds
      setTimeout(() => setSaveMsg(''), 3000)
    }
  }

  // ── Cancel edit — reset form to original values ───────────────────────────
  const handleCancel = () => {
    setForm({
      name:      userProfile?.name                  ?? '',
      bio:       userProfile?.bio                   ?? '',
      instagram: userProfile?.socials?.instagram    ?? '',
      linkedin:  userProfile?.socials?.linkedin     ?? '',
      facebook:  userProfile?.socials?.facebook     ?? '',
      website:   userProfile?.socials?.website      ?? '',
    })
    setIsEditing(false)
  }

  // Show nothing while auth is loading / redirecting
  if (!userProfile && !currentUser) return null

  // Use form values in view mode too — so the page reflects unsaved
  // preview if user is mid-edit, or shows real data otherwise
  const displayName = isEditing ? form.name : (userProfile?.name ?? 'Member')
  const displayBio  = isEditing ? form.bio  : (userProfile?.bio  ?? '')
  const role        = userProfile?.role ?? 'member'

  // Gradient colours per role for the avatar
  const avatarGradient = {
    admin:     'from-amber-500 to-yellow-400',
    executive: 'from-rose-500 to-orange-400',
    member:    'from-violet-500 to-purple-400',
  }[role] ?? 'from-surface-600 to-surface-500'

  return (
    <div className="bg-surface-800 min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* ── Save toast notification ─────────────────────────────────── */}
        {saveMsg && (
          <div className={`
            fixed top-20 right-6 z-50 px-5 py-3 rounded-xl font-body text-sm shadow-xl
            ${saveMsg.includes('saved')
              ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/20 border border-red-500/30 text-red-400'
            }
          `}>
            {saveMsg}
          </div>
        )}

        {/* ── TOP SECTION: Avatar + identity + edit button ─────────────── */}
        <div className="flex flex-col sm:flex-row items-start gap-8 mb-10">

          {/* Gradient avatar */}
          <div className={`
            flex-shrink-0 w-24 h-24 rounded-full
            bg-gradient-to-br ${avatarGradient}
            flex items-center justify-center
            font-display text-4xl font-bold text-white shadow-xl
          `}>
            {displayName?.[0]?.toUpperCase() ?? '?'}
          </div>

          {/* Name + role + meta */}
          <div className="flex-1">
            {isEditing ? (
              // EDIT MODE: name is an input
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Your full name"
                className="
                  w-full max-w-sm bg-surface-700 border border-rose-gold/40
                  rounded-xl px-4 py-2 font-display text-3xl text-white
                  focus:outline-none focus:border-rose-gold mb-3
                "
              />
            ) : (
              // VIEW MODE: name is plain text
              <h1 className="font-display text-4xl font-bold text-white mb-1">
                {displayName}
              </h1>
            )}

            {/* Role badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-body text-xs uppercase tracking-wider text-amber-muted">
                {ROLE_LABEL[role]}
              </span>
              <span className="text-white/20">·</span>
              <span className="font-body text-xs text-white/30">
                {userProfile?.uploadCount ?? SAMPLE_WORKS.length} works uploaded
              </span>
            </div>
          </div>

          {/* Edit / Save / Cancel buttons */}
          <div className="flex gap-3 flex-shrink-0">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="
                    px-5 py-2 rounded-full font-body text-sm
                    bg-rose-gold text-white
                    hover:bg-rose-gold-dark transition-all duration-200
                    disabled:opacity-60
                  "
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="
                    px-5 py-2 rounded-full font-body text-sm
                    border border-surface-500/50 text-white/50
                    hover:text-white hover:border-white/30 transition-all duration-200
                  "
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="
                  px-5 py-2 rounded-full font-body text-sm
                  border border-rose-gold/40 text-rose-gold
                  hover:bg-rose-gold/10 transition-all duration-200
                "
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* ── BIO SECTION ──────────────────────────────────────────────── */}
        <div className="bg-surface-700 border border-surface-500/30 rounded-2xl p-6 mb-5">
          <h2 className="font-body text-xs uppercase tracking-[0.25em] text-rose-gold mb-4">
            About
          </h2>
          {isEditing ? (
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Write a short bio about yourself, your style, and what inspires you..."
              className="
                w-full bg-surface-600 border border-surface-500/40 rounded-xl
                px-4 py-3 font-body text-sm text-white placeholder-white/25
                focus:outline-none focus:border-rose-gold/50
                transition-colors duration-200 resize-none leading-relaxed
              "
            />
          ) : (
            <p className="font-body text-sm text-white/60 leading-relaxed">
              {displayBio || (
                <span className="italic text-white/25">
                  No bio yet. Click Edit Profile to add one.
                </span>
              )}
            </p>
          )}
        </div>

        {/* ── SOCIALS SECTION ──────────────────────────────────────────── */}
        <div className="bg-surface-700 border border-surface-500/30 rounded-2xl p-6 mb-10">
          <h2 className="font-body text-xs uppercase tracking-[0.25em] text-rose-gold mb-4">
            Socials
          </h2>

          {isEditing ? (
            // EDIT MODE: four text inputs
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { field: 'instagram', label: 'Instagram', placeholder: '@username' },
                { field: 'linkedin',  label: 'LinkedIn',  placeholder: 'linkedin.com/in/...' },
                { field: 'facebook',  label: 'Facebook',  placeholder: 'facebook.com/...' },
                { field: 'website',   label: 'Website',   placeholder: 'https://yoursite.com' },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className="font-body text-[11px] uppercase tracking-wider text-white/30 mb-1.5 block">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={placeholder}
                    className="
                      w-full bg-surface-600 border border-surface-500/40 rounded-xl
                      px-4 py-2.5 font-body text-sm text-white placeholder-white/20
                      focus:outline-none focus:border-rose-gold/50
                      transition-colors duration-200
                    "
                  />
                </div>
              ))}
            </div>
          ) : (
            // VIEW MODE: show links or placeholder text
            <div className="flex flex-wrap gap-3">
              {[
                { field: 'instagram', label: 'Instagram',  icon: 'IG' },
                { field: 'linkedin',  label: 'LinkedIn',   icon: 'LI' },
                { field: 'facebook',  label: 'Facebook',   icon: 'FB' },
                { field: 'website',   label: 'Website',    icon: '🌐' },
              ].map(({ field, label, icon }) => {
                const val = userProfile?.socials?.[field] || form[field]
                return val ? (
                  <a
                    key={field}
                    href={val.startsWith('http') ? val : `https://${val}`}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      flex items-center gap-2 px-4 py-2 rounded-full
                      bg-surface-600 border border-surface-500/30
                      font-body text-sm text-white/60
                      hover:text-white hover:border-white/30 transition-all duration-200
                    "
                  >
                    <span className="text-xs">{icon}</span>
                    {label}
                    <span className="text-white/30">↗</span>
                  </a>
                ) : null
              })}
              {!userProfile?.socials?.instagram && !userProfile?.socials?.linkedin && !form.instagram && !form.linkedin && (
                <p className="font-body text-sm italic text-white/25">
                  No socials added yet. Click Edit Profile.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── MY WORKS SECTION ─────────────────────────────────────────── */}
        <div>
          <h2 className="font-body text-xs uppercase tracking-[0.25em] text-rose-gold mb-6">
            My Works
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {SAMPLE_WORKS.map((work) => (
              <div
                key={work.id}
                className="relative group overflow-hidden rounded-xl"
              >
                <img
                  src={work.image}
                  alt={work.caption}
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className={`inline-block self-start font-body text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border mb-1 ${CATEGORY_STYLE[work.category]}`}>
                    {work.category === 'photo' ? 'Photography' : 'Art'}
                  </span>
                  <p className="font-display text-base font-semibold text-white">
                    {work.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MY ATTENDANCE QR CODE ────────────────────────────────────── */}
        <div className="mt-10 bg-surface-700 border border-surface-500/30 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Left: explanation */}
            <div className="flex-1">
              <h2 className="font-body text-xs uppercase tracking-[0.25em] text-rose-gold mb-3">
                My Attendance QR
              </h2>
              <h3 className="font-display text-2xl font-semibold text-white mb-3">
                Your Personal Check-in Code
              </h3>
              <p className="font-body text-sm text-white/50 leading-relaxed mb-4">
                Show this QR code to a club admin at events and workshops.
                They'll scan it to log your check-in and check-out times,
                which count toward your activity score.
              </p>
              <div className="flex flex-col gap-2">
                {[
                  '✓  Each check-in session = 20 activity points',
                  '✓  Appears on the Member Leaderboard',
                  '✓  Attendance history visible to admins',
                ].map((tip) => (
                  <p key={tip} className="font-body text-xs text-white/30">{tip}</p>
                ))}
              </div>
            </div>
            {/* Right: QR code */}
            <div className="flex-shrink-0">
              <QRCodeDisplay
                uid={currentUser?.uid ?? 'preview-uid'}
                name={displayName}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile
