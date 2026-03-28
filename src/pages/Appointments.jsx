import { useState, useEffect } from 'react'
import { Calendar, Clock, X, Plus } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { useToast } from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

const fallbackAppointments = [
  { id: 1, doctor: 'Dr. Priya Sharma', specialty: 'Cardiology', date: '2026-04-02', time: '10:00 AM', status: 'Confirmed' },
  { id: 2, doctor: 'Dr. Arjun Nair', specialty: 'Dermatology', date: '2026-04-05', time: '2:30 PM', status: 'Pending' },
  { id: 3, doctor: 'Dr. Lakshmi Rao', specialty: 'Neurology', date: '2026-04-10', time: '11:00 AM', status: 'Confirmed' },
  { id: 4, doctor: 'Dr. Rahul Mehta', specialty: 'Orthopedics', date: '2026-02-15', time: '09:00 AM', status: 'Completed' },
  { id: 5, doctor: 'Dr. Priya Sharma', specialty: 'Cardiology', date: '2025-11-20', time: '04:15 PM', status: 'Completed' },
]

export default function Appointments() {
  const { addToast } = useToast()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('upcoming')
  const [showBookModal, setShowBookModal] = useState(false)
  const [cancelTarget, setCancelTarget] = useState(null)

  // Booking form state
  const [bookDoctor, setBookDoctor] = useState('')
  const [bookSpecialty, setBookSpecialty] = useState('')
  const [bookDate, setBookDate] = useState('')
  const [bookTime, setBookTime] = useState('')
  const [isBooking, setIsBooking] = useState(false)

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
        addToast('Failed to load appointments. Using offline data.', 'warning')
        setAppointments(fallbackAppointments)
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [])

  const cancelAppointment = async () => {
    if (!cancelTarget) return
    const id = cancelTarget

    setAppointments(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'Cancelled' } : a
    ))
    setCancelTarget(null)

    if (supabase) {
      try {
        const { error } = await supabase.from('appointments').update({ status: 'Cancelled' }).eq('id', id)
        if (error) throw error
        addToast('Appointment cancelled successfully.', 'success')
      } catch (err) {
        console.error('Error cancelling:', err.message)
        addToast('Failed to cancel appointment. Please try again.', 'error')
      }
    } else {
      addToast('Appointment cancelled (offline mode).', 'success')
    }
  }

  const handleBook = async (e) => {
    e.preventDefault()
    if (!bookDoctor || !bookDate || !bookTime) return

    setIsBooking(true)
    const newAppt = {
      doctor: bookDoctor,
      specialty: bookSpecialty || 'General',
      date: bookDate,
      time: bookTime,
      status: 'Pending',
    }

    if (supabase) {
      try {
        const { data, error } = await supabase.from('appointments').insert([newAppt]).select()
        if (error) throw error
        if (data?.[0]) newAppt.id = data[0].id
        addToast('Appointment booked successfully!', 'success')
      } catch (err) {
        console.error('Error booking:', err.message)
        addToast('Failed to book appointment. Saved locally.', 'warning')
        newAppt.id = Date.now()
      }
    } else {
      newAppt.id = Date.now()
      addToast('Appointment booked (offline mode).', 'success')
    }

    setAppointments(prev => [...prev, newAppt])
    setBookDoctor('')
    setBookSpecialty('')
    setBookDate('')
    setBookTime('')
    setIsBooking(false)
    setShowBookModal(false)
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

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={() => setShowBookModal(true)}>
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
                      onClick={() => setCancelTarget(a.id)}
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

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="modal-overlay" onClick={() => setShowBookModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book New Appointment</h2>
              <button
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setShowBookModal(false)}
              >
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleBook}>
              <div className="form-group">
                <label className="form-label">Doctor Name</label>
                <input type="text" className="form-input" placeholder="e.g. Dr. Priya Sharma" value={bookDoctor} onChange={e => setBookDoctor(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Specialty</label>
                <select className="form-input" value={bookSpecialty} onChange={e => setBookSpecialty(e.target.value)}>
                  <option value="">Select specialty</option>
                  <option>Cardiology</option>
                  <option>Dermatology</option>
                  <option>Neurology</option>
                  <option>Orthopedics</option>
                  <option>Pediatrics</option>
                  <option>General</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-input" value={bookDate} onChange={e => setBookDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Time</label>
                <input type="time" className="form-input" value={bookTime} onChange={e => setBookTime(e.target.value)} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowBookModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={isBooking}>
                  {isBooking ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelTarget && (
        <ConfirmModal
          title="Cancel Appointment"
          message="Are you sure you want to cancel this appointment? This action cannot be undone."
          confirmText="Yes, Cancel It"
          danger
          onConfirm={cancelAppointment}
          onCancel={() => setCancelTarget(null)}
        />
      )}
    </div>
  )
}
