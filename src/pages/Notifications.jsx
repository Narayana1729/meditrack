import { useState } from 'react'

const initial = [
  { id: 1, type: 'Reminder', message: 'Take Metformin at 8:00 AM', time: '7:55 AM', read: false },
  { id: 2, type: 'Appointment', message: 'Appointment with Dr. Priya confirmed for Apr 2', time: 'Yesterday', read: false },
  { id: 3, type: 'Report', message: 'Your blood test report is ready', time: '2 days ago', read: true },
  { id: 4, type: 'Reminder', message: 'Take Aspirin at 8:00 AM', time: '3 days ago', read: true },
]

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '.25rem' }}>
            🔔 Notifications
            {unreadCount > 0 && (
              <span style={{
                marginLeft: '.5rem', background: '#4f8ef7', color: '#fff',
                borderRadius: '999px', fontSize: '.7rem', padding: '.15rem .55rem', fontWeight: 700
              }}>
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="page-subtitle">Stay updated with your health alerts.</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn-primary" style={{ marginBottom: 0 }} onClick={markAllRead}>
            ✓ Mark all as read
          </button>
        )}
      </div>

      <div className="notif-list">
        {notifications.map(n => (
          <div
            className={`notif-card ${n.read ? 'read' : 'unread'}`}
            key={n.id}
            onClick={() => markOne(n.id)}
            style={{ cursor: n.read ? 'default' : 'pointer' }}
          >
            <div className="notif-dot" />
            <div className="notif-body">
              <span className="notif-type">{n.type}</span>
              <p>{n.message}</p>
              <small>{n.time}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
