import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, Search, FileText,
  Pill, Bell, BarChart3, User
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/appointments', label: 'Appts', icon: Calendar },
  { path: '/medicine-reminder', label: 'Meds', icon: Pill },
  { path: '/notifications', label: 'Alerts', icon: Bell },
  { path: '/profile', label: 'Profile', icon: User },
]

export default function MobileNav() {
  return (
    <nav className="mobile-nav">
      {navItems.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
