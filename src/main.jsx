// main.jsx — the entry point of the entire app
// 
// We wrap <App /> in <AuthProvider> so that every page and component
// inside the app can access the login state via useAuth().
//
// Think of it like putting the whole building inside the announcement
// system — now every room can hear the broadcast.

import React          from 'react'
import ReactDOM       from 'react-dom/client'
import App            from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
