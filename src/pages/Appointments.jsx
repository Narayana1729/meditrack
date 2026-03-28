import { useState } from 'react'

const initialAppointments = [
  { id: 1, doctor: 'Dr. Priya Sharma', specialty: 'Cardiology', date: '2026-04-02', time: '10:00 AM', status: 'Confirmed' },
  { id: 2, doctor: 'Dr. Arjun Nair', specialty: 'Dermatology', date: '2026-04-05', time: '2:30 PM', status: 'Pending' },
  { id: 3, doctor: 'Dr. Lakshmi Rao', specialty: 'Neurology', date: '2026-04-10', time: '11:00 AM', status: 'Confirmed' },
  { id: 4, doctor: 'Dr. Rahul Mehta', specialty: 'Orthopedics', date: '2026-02-15', time: '09:00 AM', status: 'Completed' },
  { id: 5, doctor: 'Dr. Priya Sharma', specialty: 'Cardiology', date: '2025-11-20', time: '04:15 PM', status: 'Completed' },
]

export default function Appointments() {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [tab, setTab] = useState('upcoming') // 'upcoming' | 'past'

  const cancelAppointment = (id) => {
    if (confirm('Cancel this appointment?')) {
      setAppointments(prev => prev.map(a => 
        a.id === id ? { ...a, status: 'Cancelled' } : a
      ))
    }
  }

  const filtered = appointments.filter(a => {
    const isPast = ['Completed', 'Cancelled'].includes(a.status)
    return tab === 'upcoming' ? !isPast : isPast
  })

  return (
    <div className="page">
      <h1 className="page-title">📅 Appointments</h1>
      <p className="page-subtitle">Manage your medical visits and history.</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <button className="btn-primary" style={{ margin: 0 }}>+ Book New</button>
        <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', padding: '0.2rem' }}>
          <button 
            onClick={() => setTab('upcoming')}
            style={{ 
              padding: '0.4rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer',
              background: tab === 'upcoming' ? 'var(--primary)' : 'transparent',
              color: tab === 'upcoming' ? '#fff' : 'var(--text)'
            }}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setTab('past')}
            style={{ 
              padding: '0.4rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer',
              background: tab === 'past' ? 'var(--primary)' : 'transparent',
              color: tab === 'past' ? '#fff' : 'var(--text)'
            }}
          >
            Past History
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialty</th>
              <th>Date & Time</th>
              <th>Status</th>
              {tab === 'upcoming' && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No {tab} appointments</td></tr>
            ) : filtered.map(a => (
              <tr key={a.id}>
                <td><strong>{a.doctor}</strong></td>
                <td>{a.specialty}</td>
                <td>{a.date} <span style={{ color: 'var(--muted)' }}>at {a.time}</span></td>
                <td>
                  <span className={`badge ${a.status.toLowerCase()}`}>{a.status}</span>
                </td>
                {tab === 'upcoming' && (
                  <td>
                    <button 
                      onClick={() => cancelAppointment(a.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
                    >
                      Cancel
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
