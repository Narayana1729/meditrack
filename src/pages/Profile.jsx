import { useState } from 'react'

const initialUser = {
  name: 'Srimannarayana Deevi',
  age: 22,
  blood: 'O+',
  email: 'narayana@meditrack.app',
  phone: '+91 98765 43210',
  conditions: ['Type 2 Diabetes', 'Hypertension'],
  allergies: ['Penicillin'],
}

export default function Profile() {
  const [user, setUser] = useState(initialUser)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    setIsEditing(false)
    // Here we would normally save to a database
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">👤 My Profile</h1>
          <p className="page-subtitle">Manage your personal health details.</p>
        </div>
        <button 
          className={isEditing ? "btn-primary" : "btn-toggle"} 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          style={{ marginBottom: '1.5rem' }}
        >
          {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
        </button>
      </div>

      <div className="profile-card" style={{ borderTop: '4px solid var(--primary)' }}>
        <div className="profile-avatar">{user.name[0]}</div>
        <div className="profile-info">
          {isEditing ? (
            <input 
              value={user.name} 
              onChange={e => setUser({...user, name: e.target.value})}
              className="search-input"
              style={{ padding: '0.4rem', marginBottom: '0.5rem', width: '100%', maxWidth: '300px' }}
            />
          ) : (
            <h2>{user.name}</h2>
          )}
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <p><strong>Age:</strong> {user.age} yrs</p>
            <p><strong>Blood Group:</strong> <span className="badge confirmed">{user.blood}</span></p>
          </div>
          
          <div style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <p>📧 {user.email}</p>
            <p>📞 {user.phone}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="placeholder-box" style={{ borderTop: '3px solid var(--warning)' }}>
          <h3>🩺 Chronic Conditions</h3>
          <ul style={{ lineHeight: '1.8' }}>
            {user.conditions.map(c => <li key={c}>{c}</li>)}
          </ul>
        </div>

        <div className="placeholder-box" style={{ borderTop: '3px solid var(--danger)' }}>
          <h3>⚠️ Known Allergies</h3>
          <ul style={{ lineHeight: '1.8' }}>
            {user.allergies.map(a => <li key={a}>{a}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}
