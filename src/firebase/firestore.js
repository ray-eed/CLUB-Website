// firebase/firestore.js
//
// Helper functions for reading and writing to the Firestore database.
// The rest of the app imports these — no page needs to know Firebase details.

import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

// ─────────────────────────────────────────────────────────────────────────────
// USER PROFILE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Get a single user's profile by their uid
export async function getUserProfile(uid) {
  const ref  = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  return snap.exists() ? { uid, ...snap.data() } : null
}

// Update the logged-in user's profile
// `data` = only the fields you want to change — Firestore merges automatically
export async function updateUserProfile(uid, data) {
  const ref = doc(db, 'users', uid)
  return updateDoc(ref, data)
}

// Get all users sorted by activity score (for Leaderboard)
export async function getAllUsers() {
  const ref  = collection(db, 'users')
  const q    = query(ref, orderBy('activityScore', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }))
}

// Get all posts by a specific author (for Profile page)
export async function getPostsByAuthor(authorUid) {
  const ref  = collection(db, 'posts')
  const q    = query(ref, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({ postId: d.id, ...d.data() }))
    .filter((p) => p.authorUid === authorUid)
}

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE HELPERS
//
// Data model (Firestore collection: "attendanceSessions"):
// {
//   uid:        string   — the member's user ID
//   memberName: string   — their display name (denormalised for easy reading)
//   checkIn:    Timestamp
//   checkOut:   Timestamp | null
//   duration:   number | null  — session length in minutes
// }
// ─────────────────────────────────────────────────────────────────────────────

// Check if a member currently has an open (not checked out) session
// Returns the session document (id + data) or null
export async function getActiveSession(uid) {
  const ref  = collection(db, 'attendanceSessions')
  // Look for a session for this uid where checkOut is null
  const q    = query(
    ref,
    where('uid', '==', uid),
    where('checkOut', '==', null),
    limit(1),
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { sessionId: d.id, ...d.data() }
}

// Log a new check-in for a member
export async function logCheckIn(uid, memberName) {
  const ref = collection(db, 'attendanceSessions')
  return addDoc(ref, {
    uid,
    memberName,
    checkIn:  serverTimestamp(), // Firebase server time — more reliable than local time
    checkOut: null,
    duration: null,
  })
}

// Log a check-out for an existing session
// checkInMillis = the checkIn timestamp in milliseconds (for duration calc)
export async function logCheckOut(sessionId, checkInMillis) {
  const now          = Date.now()
  const durationMins = Math.round((now - checkInMillis) / 60000)
  const ref          = doc(db, 'attendanceSessions', sessionId)
  return updateDoc(ref, {
    checkOut: serverTimestamp(),
    duration: durationMins,
  })
}

// Get the N most recent attendance sessions (for admin history view)
export async function getRecentSessions(n = 30) {
  const ref  = collection(db, 'attendanceSessions')
  const q    = query(ref, orderBy('checkIn', 'desc'), limit(n))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ sessionId: d.id, ...d.data() }))
}

// Increment a user's upload count and activity score after an upload
export async function incrementUploadCount(uid) {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return
  const { uploadCount = 0, activityScore = 0 } = snap.data()
  return updateDoc(ref, {
    uploadCount:   uploadCount   + 1,
    activityScore: activityScore + 10, // each upload = 10 pts
  })
}
