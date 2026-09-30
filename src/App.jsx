// App.jsx — routing hub + shared layout
//
// useLocation() lets us check the current URL.
// We use it to HIDE the Navbar and Footer on the /login page —
// because Login has its own full-screen layout and doesn't need them.

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar          from './components/Navbar'
import Footer          from './components/Footer'
import Home            from './pages/Home'
import Achievements    from './pages/Achievements'
import CreativeHub     from './pages/CreativeHub'
import MemberDirectory from './pages/MemberDirectory'
import Profile         from './pages/Profile'
import Leaderboard     from './pages/Leaderboard'
import Attendance      from './pages/Attendance'
import AdminDashboard  from './pages/AdminDashboard'
import Login           from './pages/Login'

// Pages where Navbar and Footer should NOT appear
const PAGES_WITHOUT_CHROME = ['/login']

// Inner component — must be INSIDE BrowserRouter to use useLocation
function AppLayout() {
  const location = useLocation()
  const hideChrome = PAGES_WITHOUT_CHROME.includes(location.pathname)

  return (
    <>
      {/* Only render Navbar/Footer on pages that need them */}
      {!hideChrome && <Navbar />}

      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/achievements"  element={<Achievements />} />
        <Route path="/creative-hub"  element={<CreativeHub />} />
        <Route path="/members"       element={<MemberDirectory />} />
        <Route path="/profile"       element={<Profile />} />
        <Route path="/leaderboard"   element={<Leaderboard />} />
        <Route path="/attendance"    element={<Attendance />} />
        <Route path="/admin"         element={<AdminDashboard />} />
        <Route path="/login"         element={<Login />} />
      </Routes>

      {!hideChrome && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
