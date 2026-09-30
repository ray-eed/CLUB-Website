// context/AuthContext.jsx
//
// WHAT IS CONTEXT?
// Imagine your app is a building. Each page/component is a room.
// "Context" is like a building-wide announcement system —
// you broadcast information once (who is logged in),
// and any room in the building can tune in and listen.
//
// Without context, you'd have to pass login info from room to room
// manually, which gets messy fast.

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc }        from 'firebase/firestore'
import { auth, db }           from '../firebase/config'

// Step 1: Create the "announcement channel"
// AuthContext is the channel. Right now it's empty — we'll fill it below.
const AuthContext = createContext(null)

// Step 2: Create the "broadcaster" — the AuthProvider component
// Wrap your whole app in this, and every page inside can tune in.
export function AuthProvider({ children }) {
  // currentUser: the raw Firebase user object (email, uid, etc.)
  // null = no one is logged in
  const [currentUser, setCurrentUser] = useState(null)

  // userProfile: extra info from Firestore (name, role, bio, etc.)
  // This is the data YOU store — Firebase Auth only holds email + uid
  const [userProfile, setUserProfile] = useState(null)

  // loading: true while we're checking if someone is already logged in
  // (e.g. the user refreshed the page — we need a moment to re-check)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mocked Firebase auth listener (bypassing Firebase to fix the white screen locally)
    const timer = setTimeout(() => {
      setCurrentUser(null)
      setUserProfile(null)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Step 3: Package up everything we want to share
  const value = {
    currentUser,   // the raw Firebase user (or null)
    userProfile,   // their Firestore data: name, role, bio, etc.
    loading,       // true while we're still checking login state
    isLoggedIn: !!currentUser,              // simple true/false
    isAdmin: userProfile?.role === 'admin', // true only for admins
  }

  // While we're still checking login state, render nothing
  // (avoids a flash where a protected page briefly shows before redirecting)
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-800 flex items-center justify-center">
        <p className="text-rose-gold font-display text-xl animate-pulse">
          Loading...
        </p>
      </div>
    )
  }

  // Broadcast the value to all children (the whole app)
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Step 4: Export the context itself (needed by the useAuth hook)
export default AuthContext
