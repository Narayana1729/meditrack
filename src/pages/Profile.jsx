import { useState, useEffect } from 'react'
import { User, Mail, Phone, Shield, AlertTriangle, Save, Edit3 } from 'lucide-react'
import { supabase } from '../supabaseClient'

const fallbackUser = {
  name: 'Srimannarayana Deevi',
  age: 22,
  blood: 'O+',
  email: 'narayana@meditrack.app',
  phone: '+91 98765 43210',
  conditions: ['Type 2 Diabetes', 'Hypertension'],
  allergies: ['Penicillin'],
}

export default function Profile() {
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      if (!supabase) {
        setUser(fallbackUser)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1).single()
        if (error) throw error
        if (data) {
          data.conditions = typeof data.conditions === 'string' ? JSON.parse(data.conditions) : data.conditions
          data.allergies = typeof data.allergies === 'string' ? JSON.parse(data.allergies) : data.allergies
          setUser(data)
        }
      } catch (err) {
        console.error('Error fetching profile:', err.message)
        setUser(fallbackUser)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    setIsEditing(false)

    if (supabase) {
      try {
        const updateData = { ...user }
        const { error } = await supabase.from('profiles').upsert([{ id: 1, ...updateData }])
        if (error) throw error
      } catch (err) {
        console.error('Error saving profile:', err.message)
      }
    }
  }

  if (loading || !user) {
    return <div className="page" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading profile...</div>
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your personal health details.</p>
        </div>
        <button
          className={isEditing ? 'btn-primary' : 'btn-secondary'}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? <><Save size={16} /> Save Changes</> : <><Edit3 size={16} /> Edit Profile</>}
        </button>
      </div>

      {/* Profile Card */}
      <div className="profile-card animate-slide-up">
        <div className="profile-avatar">{user.name[0]}</div>
        <div className="profile-info" style={{ flex: 1 }}>
          {isEditing ? (
            <input
              value={user.name}
              onChange={e => setUser({ ...user, name: e.target.value })}
              className="form-input"
              style={{ maxWidth: '320px', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}
            />
          ) : (
            <h2>{user.name}</h2>
          )}

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Age:</span>
                <input type="number" value={user.age} onChange={e => setUser({ ...user, age: e.target.value })} className="form-input" style={{ width: '70px', padding: '0.3rem 0.5rem' }} />
              </div>
            ) : (
              <p><strong>Age:</strong> {user.age} yrs</p>
            )}

            {isEditing ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Blood:</span>
                <input value={user.blood} onChange={e => setUser({ ...user, blood: e.target.value })} className="form-input" style={{ width: '70px', padding: '0.3rem 0.5rem' }} />
              </div>
            ) : (
              <p><strong>Blood Group:</strong> <span className="badge success">{user.blood}</span></p>
            )}
          </div>

          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={15} color="var(--text-muted)" />
              {isEditing ? (
                <input value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} className="form-input" style={{ maxWidth: '280px' }} />
              ) : (
                user.email
              )}
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={15} color="var(--text-muted)" />
              {isEditing ? (
                <input value={user.phone} onChange={e => setUser({ ...user, phone: e.target.value })} className="form-input" style={{ maxWidth: '200px' }} />
              ) : (
                user.phone
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Conditions & Allergies */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginTop: '0.5rem' }}>
        <div className="card animate-slide-up" style={{ borderTop: '3px solid var(--warning)', animationDelay: '0.1s' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Shield size={18} color="var(--warning)" /> Chronic Conditions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {user.conditions && user.conditions.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'var(--warning-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 500 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--warning)', flexShrink: 0 }} />
                {c}
              </div>
            ))}
          </div>
        </div>

        <div className="card animate-slide-up" style={{ borderTop: '3px solid var(--danger)', animationDelay: '0.15s' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle size={18} color="var(--danger)" /> Known Allergies
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {user.allergies && user.allergies.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'var(--danger-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 500, color: 'var(--danger)' }}>
                <AlertTriangle size={14} />
                {a}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
