import { useState, useEffect } from 'react'
import { Calendar, Clock, X, Plus } from 'lucide-react'
import { supabase } from '../supabaseClient'

const fallbackAppointments = [
  { id: 1, doctor: 'Dr. Priya Sharma', specialty: 'Cardiology', date: '2026-04-02', time: '10:00 AM', status: 'Confirmed' },
  { id: 2, doctor: 'Dr. Arjun Nair', specialty: 'Dermatology', date: '2026-04-05', time: '2:30 PM', status: 'Pending' },
  { id: 3, doctor: 'Dr. Lakshmi Rao', specialty: 'Neurology', date: '2026-04-10', time: '11:00 AM', status: 'Confirmed' },
  { id: 4, doctor: 'Dr. Rahul Mehta', specialty: 'Orthopedics', date: '2026-02-15', time: '09:00 AM', status: 'Completed' },
  { id: 5, doctor: 'Dr. Priya Sharma', specialty: 'Cardiology', date: '2025-11-20', time: '04:15 PM', status: 'Completed' },
]

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('upcoming')

  useEffect(() => {
    async function fetchAppointments() {
      if (!supabase) {
        setAppointments(fallbackAppointments)
        setLoading(false)
        return
      }
      try {
        const { data, error } = await supabase.from('appointments').select('*').order('date', { ascending: true })
        if (error) throw error
        setAppointments(data?.length ? data : fallbackAppointments)
      } catch (err) {
        console.error('Error fetching appointments:', err.message)
        setAppointments(fallbackAppointments)
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [])

  const cancelAppointment = async (id) => {
    if (!confirm('Cancel this appointment?')) return

    setAppointments(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'Cancelled' } : a
    ))

    if (supabase) {
      try {
        await supabase.from('appointments').update({ status: 'Cancelled' }).eq('id', id)
      } catch (err) {
        console.error('Error cancelling:', err.message)
      }
    }
  }

  const filtered = appointments.filter(a => {
    const isPast = ['Completed', 'Cancelled'].includes(a.status)
    return tab === 'upcoming' ? !isPast : isPast
  })

  if (loading) {
    return <div className="page" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading appointments...</div>
  }

  return (
    <div className="page">
      <h1 className="page-title">Appointments</h1>
      <p className="page-subtitle">Manage your medical visits and history.</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <button className="btn-primary">
          <Plus size={16} /> Book New
        </button>
        <div className="tab-group">
          <button
            className={`tab-btn ${tab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setTab('upcoming')}
          >
            <Calendar size={14} style={{ marginRight: '0.3rem' }} /> Upcoming
          </button>
          <button
            className={`tab-btn ${tab === 'past' ? 'active' : ''}`}
            onClick={() => setTab('past')}
          >
            <Clock size={14} style={{ marginRight: '0.3rem' }} /> Past History
          </button>
        </div>
      </div>

      <div className="table-wrapper animate-slide-up">
        <table className="data-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialty</th>
              <th>Date & Time</th>
              <th>Status</th>
              {tab === 'upcoming' && <th style={{ textAlign: 'right' }}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>No {tab} appointments</td></tr>
            ) : filtered.map(a => (
              <tr key={a.id}>
                <td><strong>{a.doctor}</strong></td>
                <td>{a.specialty}</td>
                <td>{a.date} <span style={{ color: 'var(--text-muted)' }}>at {a.time}</span></td>
                <td>
                  <span className={`badge ${a.status.toLowerCase()}`}>{a.status}</span>
                </td>
                {tab === 'upcoming' && (
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-danger"
                      onClick={() => cancelAppointment(a.id)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem' }}
                    >
                      <X size={14} /> Cancel
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
