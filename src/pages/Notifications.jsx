import { useState } from 'react'
import { Bell, CheckCheck, Pill, Calendar, FileText, AlertCircle } from 'lucide-react'

const initial = [
  { id: 1, type: 'Reminder', message: 'Take Metformin at 8:00 AM', time: '7:55 AM', read: false },
  { id: 2, type: 'Appointment', message: 'Appointment with Dr. Priya confirmed for Apr 2', time: 'Yesterday', read: false },
  { id: 3, type: 'Report', message: 'Your blood test report is ready', time: '2 days ago', read: true },
  { id: 4, type: 'Reminder', message: 'Take Aspirin at 8:00 AM', time: '3 days ago', read: true },
]

const typeIcons = {
  Reminder: Pill,
  Appointment: Calendar,
  Report: FileText,
}

const typeColors = {
  Reminder: '#10B981',
  Appointment: '#4F46E5',
  Report: '#F59E0B',
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(initial)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  const markOne = id =>
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Notifications
            {unreadCount > 0 && (
              <span className="badge info" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="page-subtitle">Stay updated with your health alerts.</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn-secondary" onClick={markAllRead}>
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <Bell size={48} />
          <h2>All caught up!</h2>
          <p>You have no notifications.</p>
        </div>
      ) : (
        <div className="notif-list">
          {notifications.map((n, i) => {
            const NIcon = typeIcons[n.type] || AlertCircle
            const nColor = typeColors[n.type] || '#64748B'
            return (
              <div
                className={`notif-card animate-slide-up ${n.read ? 'read' : 'unread'}`}
                key={n.id}
                onClick={() => markOne(n.id)}
                style={{ cursor: n.read ? 'default' : 'pointer', animationDelay: `${i * 0.06}s` }}
              >
                <div
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: `${nColor}18`, color: nColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '0.1rem'
                  }}
                >
                  <NIcon size={16} />
                </div>
                <div className="notif-body" style={{ flex: 1 }}>
                  <span className="notif-type">{n.type}</span>
                  <p>{n.message}</p>
                  <small>{n.time}</small>
                </div>
                {!n.read && <div className="notif-dot" style={{ marginTop: '0.5rem' }} />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
