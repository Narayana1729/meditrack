import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar, Pill, FileText, Bell,
  Heart, Activity, Droplets, Thermometer, Wind, Scale,
  CalendarCheck, Upload, BarChart3, ClipboardList,
  ArrowRight, CheckCircle2
} from 'lucide-react'
import { supabase } from '../supabaseClient'
import { useUser } from '../context/UserContext'

/* ── Fallback Data ── */
const fallbackVitals = [
  { id: 1, metric: 'Heart Rate', value: '72', unit: 'bpm' },
  { id: 2, metric: 'Blood Pressure', value: '120/80', unit: 'mmHg' },
  { id: 3, metric: 'Blood Sugar', value: '98', unit: 'mg/dL' },
  { id: 4, metric: 'SpO2', value: '98', unit: '%' },
  { id: 5, metric: 'Body Temp', value: '98.4', unit: '°F' },
  { id: 6, metric: 'BMI', value: '22.4', unit: 'kg/m²' },
]

const fallbackAppointments = [
  { id: 1, doctor: 'Dr. Priya Sharma', specialty: 'Cardiology', date: '2026-04-02', time: '10:00 AM', status: 'Confirmed' },
  { id: 2, doctor: 'Dr. Arjun Nair', specialty: 'Dermatology', date: '2026-04-05', time: '2:30 PM', status: 'Pending' },
  { id: 3, doctor: 'Dr. Lakshmi Rao', specialty: 'Neurology', date: '2026-04-10', time: '11:00 AM', status: 'Confirmed' },
]

const fallbackMedicines = [
  { id: 1, name: 'Metformin', dosage: '500mg', taken: false },
  { id: 2, name: 'Atorvastatin', dosage: '10mg', taken: true },
  { id: 3, name: 'Aspirin', dosage: '75mg', taken: false },
]

const fallbackActivity = [
  { id: 1, action: 'medicine_taken', description: 'Took Atorvastatin 10mg', icon: 'pill', created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 2, action: 'appointment_confirmed', description: 'Appointment with Dr. Priya confirmed for Apr 2', icon: 'calendar-check', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, action: 'report_ready', description: 'Blood Sugar Trend report is ready', icon: 'file-text', created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 4, action: 'record_uploaded', description: 'Uploaded Blood Test results', icon: 'upload', created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
]

/* ── Helpers ── */
const vitalIcons = {
  'Heart Rate': Heart,
  'Blood Pressure': Activity,
  'Blood Sugar': Droplets,
  'SpO2': Wind,
  'Body Temp': Thermometer,
  'BMI': Scale,
}

const vitalColors = {
  'Heart Rate': '#EF4444',
  'Blood Pressure': '#4F46E5',
  'Blood Sugar': '#F59E0B',
  'SpO2': '#0EA5E9',
  'Body Temp': '#10B981',
  'BMI': '#8B5CF6',
}

const activityIcons = {
  'pill': Pill,
  'calendar-check': CalendarCheck,
  'file-text': FileText,
  'upload': Upload,
  'activity': Activity,
}

const activityColors = {
  'medicine_taken': '#10B981',
  'appointment_confirmed': '#4F46E5',
  'report_ready': '#F59E0B',
  'record_uploaded': '#0EA5E9',
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function formatDateBadge(dateStr) {
  // Use split to avoid timezone issues with date-only strings
  const parts = dateStr.split('-')
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
  return {
    day: d.getDate(),
    month: d.toLocaleString('default', { month: 'short' })
  }
}

export default function Dashboard() {
  const { user } = useUser()
  const [vitals, setVitals] = useState([])
  const [appointments, setAppointments] = useState([])
  const [medicines, setMedicines] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    async function fetchDashboardData() {
      if (!supabase) {
        setVitals(fallbackVitals)
        setAppointments(fallbackAppointments)
        setMedicines(fallbackMedicines)
        setActivity(fallbackActivity)
        setLoading(false)
        return
      }

      try {
        const [vitalsRes, apptRes, medsRes, actRes, notifRes] = await Promise.allSettled([
          supabase.from('vitals').select('*').order('recorded_at', { ascending: false }).limit(6),
          supabase.from('appointments').select('*').order('date', { ascending: true }).limit(10),
          supabase.from('medicines').select('*'),
          supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('notifications').select('*').eq('read', false),
        ])

        setVitals(vitalsRes.status === 'fulfilled' && vitalsRes.value.data?.length ? vitalsRes.value.data : fallbackVitals)

        // Filter upcoming only
        const today = new Date().toISOString().split('T')[0]
        const apptData = apptRes.status === 'fulfilled' && apptRes.value.data?.length
          ? apptRes.value.data.filter(a => a.date >= today && a.status !== 'Completed' && a.status !== 'Cancelled')
          : fallbackAppointments
        setAppointments(apptData.slice(0, 3))

        setMedicines(medsRes.status === 'fulfilled' && medsRes.value.data?.length ? medsRes.value.data : fallbackMedicines)
        setActivity(actRes.status === 'fulfilled' && actRes.value.data?.length ? actRes.value.data : fallbackActivity)

        // Dynamic notification count
        const notifData = notifRes.status === 'fulfilled' && notifRes.value.data ? notifRes.value.data : []
        setNotifications(notifData)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
        setVitals(fallbackVitals)
        setAppointments(fallbackAppointments)
        setMedicines(fallbackMedicines)
        setActivity(fallbackActivity)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', animation: 'pulse 1.5s infinite' }}>Loading your dashboard...</p>
      </div>
    )
  }

  const displayName = user?.name?.split(' ')[0] || 'there'
  const totalMeds = medicines.length
  const takenMeds = medicines.filter(m => m.taken).length
  const unreadAlerts = notifications.length || 0

  // Count reports dynamically (pending = processing ones)
  const pendingReports = activity.filter(a => a.action === 'report_ready').length

  const statCards = [
    { label: 'Upcoming Appointments', value: appointments.length, icon: Calendar, color: '#4F46E5', bg: 'rgba(79,70,229,0.1)' },
    { label: 'Active Prescriptions', value: totalMeds, icon: Pill, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Meds Taken Today', value: `${takenMeds}/${totalMeds}`, icon: BarChart3, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Unread Alerts', value: unreadAlerts, icon: Bell, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  ]

  return (
    <div className="page">
      {/* Greeting */}
      <div className="dashboard-greeting animate-slide-up">
        <h1>{getGreeting()}, {displayName} 👋</h1>
        <p>Here's your health overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        {statCards.map(({ label, value, icon: Icon, color, bg }, i) => (
          <div
            className="stat-card animate-slide-up"
            key={label}
            style={{ '--stat-accent': color, animationDelay: `${i * 0.08}s` }}
          >
            <div className="stat-icon-wrap" style={{ background: bg, color }}>
              <Icon size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-value" style={{ color }}>{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Health Vitals */}
        <div className="dashboard-section animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="dashboard-section-header">
            <h2><Activity size={18} /> Health Vitals</h2>
            <Link to="/health-records">View All</Link>
          </div>
          <div className="vitals-grid">
            {vitals.map(v => {
              const VIcon = vitalIcons[v.metric] || Activity
              const vColor = vitalColors[v.metric] || '#4F46E5'
              return (
                <div className="vital-card" key={v.id || v.metric}>
                  <div className="vital-header">
                    <VIcon size={14} color={vColor} />
                    {v.metric}
                  </div>
                  <div>
                    <span className="vital-value" style={{ color: vColor }}>{v.value}</span>
                    <span className="vital-unit">{v.unit}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="dashboard-section animate-slide-up" style={{ animationDelay: '0.35s' }}>
          <div className="dashboard-section-header">
            <h2><Calendar size={18} /> Upcoming</h2>
            <Link to="/appointments">View All</Link>
          </div>
          {appointments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No upcoming appointments</p>
          ) : (
            <div className="upcoming-list">
              {appointments.map(a => {
                const { day, month } = formatDateBadge(a.date)
                return (
                  <div className="upcoming-item" key={a.id}>
                    <div className="upcoming-date-badge">
                      <span className="day">{day}</span>
                      <span className="month">{month}</span>
                    </div>
                    <div className="upcoming-info">
                      <h4>{a.doctor}</h4>
                      <p>{a.specialty} · {a.time}</p>
                    </div>
                    <span className={`badge ${a.status?.toLowerCase()}`}>{a.status}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="dashboard-section-header">
            <h2><ArrowRight size={18} /> Quick Actions</h2>
          </div>
          <div className="quick-actions-grid">
            <Link to="/appointments" className="quick-action-btn">
              <div className="quick-action-icon" style={{ background: 'rgba(79,70,229,0.1)', color: '#4F46E5' }}>
                <CalendarCheck size={20} />
              </div>
              Book Appointment
            </Link>
            <Link to="/health-records" className="quick-action-btn">
              <div className="quick-action-icon" style={{ background: 'rgba(14,165,233,0.1)', color: '#0EA5E9' }}>
                <Upload size={20} />
              </div>
              Upload Record
            </Link>
            <Link to="/reports" className="quick-action-btn">
              <div className="quick-action-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>
                <BarChart3 size={20} />
              </div>
              View Reports
            </Link>
            <Link to="/medicine-reminder" className="quick-action-btn">
              <div className="quick-action-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                <ClipboardList size={20} />
              </div>
              Medicine Log
            </Link>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="dashboard-section animate-slide-up" style={{ animationDelay: '0.45s' }}>
          <div className="dashboard-section-header">
            <h2><CheckCircle2 size={18} /> Recent Activity</h2>
          </div>
          <div className="activity-list">
            {activity.map(a => {
              const AIcon = activityIcons[a.icon] || Activity
              const aColor = activityColors[a.action] || '#64748B'
              return (
                <div className="activity-item" key={a.id}>
                  <div className="activity-icon-wrap" style={{ background: `${aColor}18`, color: aColor }}>
                    <AIcon size={16} />
                  </div>
                  <div className="activity-content">
                    <p>{a.description}</p>
                    <small>{timeAgo(a.created_at)}</small>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
