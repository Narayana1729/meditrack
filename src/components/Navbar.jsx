import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, Calendar, Search, FileText, 
  Pill, Bell, BarChart3, User, Sun, Moon 
} from 'lucide-react'
import { useEffect, useState } from 'react'
import './Navbar.css'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/appointments', label: 'Appointments', icon: Calendar },
  { path: '/doctor-search', label: 'Doctors', icon: Search },
  { path: '/health-records', label: 'Records', icon: FileText },
  { path: '/medicine-reminder', label: 'Medicines', icon: Pill },
  { path: '/notifications', label: 'Alerts', icon: Bell },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/profile', label: 'Profile', icon: User },
]

export default function Navbar() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('meditrack-theme')
    return saved === 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('meditrack-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-logo">M</div>
        <span className="brand-name">MediTrack</span>
      </div>

      <ul className="nav-links">
        {navItems.map(({ path, label, icon: Icon }) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="navbar-footer">
        <button
          className="theme-toggle"
          onClick={() => setDark(d => !d)}
          title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <div className="navbar-user">
          <div className="navbar-user-avatar">S</div>
          <div className="navbar-user-info">
            <span className="navbar-user-name">Narayana</span>
            <span className="navbar-user-role">Patient</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
