import { useState, useEffect } from 'react'
import { Pill, Plus, X, Clock } from 'lucide-react'
import { supabase } from '../supabaseClient'

const fallbackMeds = [
  { id: 1, name: 'Metformin', dosage: '500mg', frequency: 'Twice a day', time: '8:00 AM, 8:00 PM', taken: false, color: '#4F46E5' },
  { id: 2, name: 'Atorvastatin', dosage: '10mg', frequency: 'Once a day', time: '9:00 PM', taken: true, color: '#10B981' },
  { id: 3, name: 'Aspirin', dosage: '75mg', frequency: 'Once a day', time: '8:00 AM', taken: false, color: '#F59E0B' },
]

const pillColors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#0EA5E9', '#8B5CF6']

export default function MedicineReminder() {
  const [meds, setMeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDosage, setNewDosage] = useState('')
  const [newFrequency, setNewFrequency] = useState('Once a day')
  const [newTime, setNewTime] = useState('')

  useEffect(() => {
    async function fetchMeds() {
      if (!supabase) {
        setMeds(fallbackMeds)
        setLoading(false)
        return
      }
      try {
        const { data, error } = await supabase.from('medicines').select('*')
        if (error) throw error
        setMeds(data?.length ? data : fallbackMeds)
      } catch (err) {
        console.error('Error fetching medicines:', err.message)
        setMeds(fallbackMeds)
      } finally {
        setLoading(false)
      }
    }
    fetchMeds()
  }, [])

  const toggle = async (id) => {
    const med = meds.find(m => m.id === id)
    if (!med) return

    const newTaken = !med.taken
    setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: newTaken } : m))

    if (supabase) {
      try {
        await supabase.from('medicines').update({ taken: newTaken }).eq('id', id)
      } catch (err) {
        console.error('Error toggling medicine:', err.message)
      }
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newName || !newTime) return

    const color = pillColors[meds.length % pillColors.length]
    const newMed = {
      name: newName,
      dosage: newDosage,
      frequency: newFrequency,
      time: newTime,
      taken: false,
      color,
    }

    if (supabase) {
      try {
        const { data, error } = await supabase.from('medicines').insert([newMed]).select()
        if (error) throw error
        if (data?.[0]) newMed.id = data[0].id
      } catch (err) {
        console.error('Error adding medicine:', err.message)
        newMed.id = Date.now()
      }
    } else {
      newMed.id = Date.now()
    }

    setMeds(prev => [...prev, newMed])
    setNewName('')
    setNewDosage('')
    setNewFrequency('Once a day')
    setNewTime('')
    setShowModal(false)
  }

  const totalMeds = meds.length
  const takenMeds = meds.filter(m => m.taken).length
  const progress = totalMeds > 0 ? (takenMeds / totalMeds) * 100 : 0
  const circumference = 2 * Math.PI * 34
  const dashOffset = circumference - (progress / 100) * circumference

  if (loading) {
    return <div className="page" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading medicines...</div>
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">Medicine Reminders</h1>
          <p className="page-subtitle">Track your daily medications and never miss a dose.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Medicine
        </button>
      </div>

      {/* Progress Section */}
      <div className="med-progress-wrap animate-slide-up">
        <div className="med-progress-ring">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle className="ring-bg" cx="40" cy="40" r="34" />
            <circle
              className="ring-fill"
              cx="40" cy="40" r="34"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <span className="med-progress-text">{takenMeds}/{totalMeds}</span>
        </div>
        <div className="med-progress-info">
          <h3>Daily Progress</h3>
          <p>{takenMeds} of {totalMeds} medications taken today. {totalMeds - takenMeds === 0 ? 'All done! 🎉' : `${totalMeds - takenMeds} remaining.`}</p>
        </div>
      </div>

      {/* Medicine List */}
      <div className="med-list">
        {meds.map((med, i) => (
          <div
            className={`med-card animate-slide-up ${med.taken ? 'taken' : ''}`}
            key={med.id}
            style={{ '--med-accent': med.color || '#4F46E5', animationDelay: `${0.1 + i * 0.06}s` }}
          >
            <div style={{ paddingLeft: '0.5rem' }}>
              <h3>
                {med.name}
                {med.dosage && <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.4rem' }}>{med.dosage}</span>}
              </h3>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={13} /> {med.frequency} · {med.time}
              </p>
            </div>
            <button
              className={`btn-toggle ${med.taken ? 'done' : ''}`}
              onClick={() => toggle(med.id)}
            >
              {med.taken ? '✅ Taken' : '⬜ Mark Taken'}
            </button>
          </div>
        ))}
      </div>

      {/* Add Medicine Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Medicine</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}>
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Medicine Name</label>
                <input type="text" className="form-input" placeholder="e.g. Metformin" value={newName} onChange={e => setNewName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Dosage</label>
                <input type="text" className="form-input" placeholder="e.g. 500mg" value={newDosage} onChange={e => setNewDosage(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Frequency</label>
                <select className="form-input" value={newFrequency} onChange={e => setNewFrequency(e.target.value)}>
                  <option>Once a day</option>
                  <option>Twice a day</option>
                  <option>Three times a day</option>
                  <option>As needed</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Time(s)</label>
                <input type="text" className="form-input" placeholder="e.g. 8:00 AM, 8:00 PM" value={newTime} onChange={e => setNewTime(e.target.value)} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary"><Pill size={16} /> Add Medicine</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
