import { useState, useEffect } from 'react'
import { Bell, CheckCheck, Pill, Calendar, FileText, AlertCircle, Trash2 } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { useToast } from '../components/Toast'

const localFallback = [
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
  const { addToast } = useToast()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingDB, setUsingDB] = useState(false)

  useEffect(() => {
    async function fetchNotifications() {
      if (!supabase) {
        setNotifications(localFallback)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        if (data && data.length > 0) {
          setNotifications(data)
          setUsingDB(true)
        } else {
          setNotifications(localFallback)
        }
      } catch {
        // Table may not exist yet — use local data
        setNotifications(localFallback)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))

    if (usingDB && supabase) {
      try {
        const { error } = await supabase.from('notifications').update({ read: true }).eq('read', false)
        if (error) throw error
      } catch (err) {
        console.error('Error marking all read:', err.message)
      }
    }
    addToast('All notifications marked as read.', 'success')
  }

  const markOne = async (id) => {
    const notif = notifications.find(n => n.id === id)
    if (!notif || notif.read) return

    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )

    if (usingDB && supabase) {
      try {
        await supabase.from('notifications').update({ read: true }).eq('id', id)
      } catch (err) {
        console.error('Error marking read:', err.message)
      }
    }
  }

  const clearAll = async () => {
    if (usingDB && supabase) {
      try {
        const { error } = await supabase.from('notifications').delete().neq('id', 0)
        if (error) throw error
      } catch (err) {
        console.error('Error clearing:', err.message)
      }
    }
    setNotifications([])
    addToast('All notifications cleared.', 'success')
  }

  if (loading) {
    return <div className="page" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading notifications...</div>
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
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
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {unreadCount > 0 && (
            <button className="btn-secondary" onClick={markAllRead}>
              <CheckCheck size={16} /> Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button className="btn-danger" onClick={clearAll} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </div>
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
                  <small>{n.time || (n.created_at ? new Date(n.created_at).toLocaleString() : '')}</small>
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
