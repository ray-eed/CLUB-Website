// firebase/config.js
// This file starts up your Firebase connection.
// Think of it like plugging Firebase into your app — you do it once here,
// and every other file can use it by importing from this file.

import { initializeApp } from 'firebase/app'
import { getAuth }       from 'firebase/auth'
import { getFirestore }  from 'firebase/firestore'
import { getStorage }    from 'firebase/storage'

// ─────────────────────────────────────────────────────
// 🔑 YOUR FIREBASE CREDENTIALS GO HERE
// Get these from: Firebase Console → Your Project → Project Settings → Your Apps
// ─────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "PASTE_YOUR_API_KEY_HERE",
  authDomain:        "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId:         "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket:     "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId:             "PASTE_YOUR_APP_ID_HERE",
}

// Initialize the Firebase app with your config
const app = initializeApp(firebaseConfig)

// Export the three Firebase services we'll use across the project
export const auth    = getAuth(app)       // handles login/logout
export const db      = getFirestore(app)  // the Firestore database
export const storage = getStorage(app)    // file/image storage
