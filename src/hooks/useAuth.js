// hooks/useAuth.js
//
// WHAT IS A HOOK?
// A hook is a small reusable function that packages up some logic.
// In React, hooks always start with the word "use".
//
// This hook is a shortcut. Instead of writing this in every component:
//
//   import { useContext } from 'react'
//   import AuthContext from '../context/AuthContext'
//   const auth = useContext(AuthContext)
//
// ...you just write:
//
//   import useAuth from '../hooks/useAuth'
//   const auth = useAuth()
//
// Much cleaner! And it gives a helpful error if you forget to wrap
// your app in <AuthProvider>.

import { useContext } from 'react'
import AuthContext    from '../context/AuthContext'

function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>. Check main.jsx.')
  }

  return context
}

export default useAuth
