import { useState } from 'react'

const doctors = [
  { id: 1, name: 'Dr. Priya Sharma', specialty: 'Cardiology', rating: 4.8, location: 'Hyderabad', available: true },
  { id: 2, name: 'Dr. Arjun Nair', specialty: 'Dermatology', rating: 4.5, location: 'Bangalore', available: false },
  { id: 3, name: 'Dr. Lakshmi Rao', specialty: 'Neurology', rating: 4.9, location: 'Chennai', available: true },
  { id: 4, name: 'Dr. Rahul Mehta', specialty: 'Orthopedics', rating: 4.3, location: 'Mumbai', available: true },
]

export default function DoctorSearch() {
  const [query, setQuery] = useState('')

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.specialty.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="page">
      <h1 className="page-title">🔍 Find a Doctor</h1>
      <p className="page-subtitle">Search by name or specialty.</p>

      <input
        className="search-input"
        type="text"
        placeholder="Search doctors or specialties..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      <div className="cards-grid">
        {filtered.map(doc => (
          <div className="doctor-card" key={doc.id}>
            <div className="doctor-avatar">{doc.name[0]}</div>
            <div className="doctor-info">
              <h3>{doc.name}</h3>
              <p>{doc.specialty} · {doc.location}</p>
              <p>⭐ {doc.rating}</p>
              <span className={`badge ${doc.available ? 'confirmed' : 'pending'}`}>
                {doc.available ? 'Available' : 'Busy'}
              </span>
            </div>
            <button className="btn-primary" disabled={!doc.available}>Book</button>
          </div>
        ))}
      </div>
    </div>
  )
}
