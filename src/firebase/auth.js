// firebase/auth.js
//
// This file wraps Firebase auth functions in our own clean helpers.
//
// WHY WRAP THEM?
// Firebase functions have verbose names and signatures.
// By wrapping them here, every page that needs login just calls
// our simple functions, e.g. loginWithEmail(email, password).
// If Firebase ever changes its API, we only update THIS file — not every page.

import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from './config'

// ── Login with email + password ───────────────────────────────────────────────
// Returns a promise. If it resolves, login worked.
// If it rejects, it throws an error with a `.code` like 'auth/wrong-password'.
export async function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

// ── Log out the current user ──────────────────────────────────────────────────
// After this, onAuthStateChanged (in AuthContext) fires and clears currentUser.
export async function logoutUser() {
  return signOut(auth)
}

// ── Send a password reset email ───────────────────────────────────────────────
// Firebase emails the user a reset link automatically.
export async function resetPassword(email) {
  return sendPasswordResetEmail(auth, email)
}

// ── Map Firebase error codes to friendly messages ─────────────────────────────
// Firebase gives codes like 'auth/wrong-password' — not great for users.
// This function turns them into readable sentences.
export function getAuthErrorMessage(code) {
  switch (code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.'
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.'
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check and try again.'
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection.'
    default:
      return 'Something went wrong. Please try again.'
  }
}
