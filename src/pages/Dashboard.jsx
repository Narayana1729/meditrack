export default function Dashboard() {
  const stats = [
    { label: 'Upcoming Appointments', value: 3, icon: '📅', color: '#4f8ef7' },
    { label: 'Active Prescriptions', value: 5, icon: '💊', color: '#34c97e' },
    { label: 'Pending Reports', value: 2, icon: '📊', color: '#f7a234' },
    { label: 'Unread Alerts', value: 1, icon: '🔔', color: '#e05c5c' },
  ]

  return (
    <div className="page">
      <h1 className="page-title">Welcome back, Narayana 👋</h1>
      <p className="page-subtitle">Here's your health overview for today.</p>

      <div className="stats-grid">
        {stats.map(({ label, value, icon, color }) => (
          <div className="stat-card" key={label} style={{ borderTop: `4px solid ${color}` }}>
            <span className="stat-icon">{icon}</span>
            <span className="stat-value" style={{ color }}>{value}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="placeholder-box">
        <h2>📌 Quick Actions</h2>
        <p>Your quick-action shortcuts will appear here.</p>
      </div>
    </div>
  )
}
