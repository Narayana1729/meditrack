import { useState } from 'react'

const initialMeds = [
  { id: 1, name: 'Metformin 500mg', frequency: 'Twice a day', time: '8:00 AM, 8:00 PM', taken: false },
  { id: 2, name: 'Atorvastatin 10mg', frequency: 'Once a day', time: '9:00 PM', taken: true },
  { id: 3, name: 'Aspirin 75mg', frequency: 'Once a day', time: '8:00 AM', taken: false },
]

export default function MedicineReminder() {
  const [meds, setMeds] = useState(initialMeds)

  const toggle = id => setMeds(prev =>
    prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m)
  )

  return (
    <div className="page">
      <h1 className="page-title">💊 Medicine Reminders</h1>
      <p className="page-subtitle">Track your daily medications.</p>

      <div className="med-list">
        {meds.map(med => (
          <div className={`med-card ${med.taken ? 'taken' : ''}`} key={med.id}>
            <div>
              <h3>{med.name}</h3>
              <p>{med.frequency} · {med.time}</p>
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
    </div>
  )
}
