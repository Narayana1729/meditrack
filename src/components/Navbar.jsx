import { NavLink } from 'react-router-dom'
import './Navbar.css'

const navItems = [
  { path: '/dashboard', label: '🏠 Dashboard' },
  { path: '/appointments', label: '📅 Appointments' },
  { path: '/doctor-search', label: '🔍 Doctors' },
  { path: '/health-records', label: '📋 Records' },
  { path: '/medicine-reminder', label: '💊 Medicines' },
  { path: '/notifications', label: '🔔 Alerts' },
  { path: '/reports', label: '📊 Reports' },
  { path: '/profile', label: '👤 Profile' },
]

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🏥</span>
        <span className="brand-name">MediTrack</span>
      </div>
      <ul className="nav-links">
        {navItems.map(({ path, label }) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
