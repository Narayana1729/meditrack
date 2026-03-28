import { useState } from 'react'
import { User, Mail, Phone, Shield, AlertTriangle, Save, Edit3, X, Plus } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useToast } from '../components/Toast'

export default function Profile() {
  const { user, updateUser, loading } = useUser()
  const { addToast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(null)
  const [newCondition, setNewCondition] = useState('')
  const [newAllergy, setNewAllergy] = useState('')

  const startEdit = () => {
    setEditData({ ...user })
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!editData) return

    // Validate
    if (!editData.name?.trim()) {
      addToast('Name cannot be empty.', 'warning')
      return
    }
    if (editData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      addToast('Please enter a valid email address.', 'warning')
      return
    }

    // Ensure age is a number
    const saveData = {
      ...editData,
      age: editData.age ? parseInt(editData.age, 10) : null,
    }

    await updateUser(saveData)
    setIsEditing(false)
    setEditData(null)
    addToast('Profile updated successfully!', 'success')
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditData(null)
  }

  const addCondition = () => {
    if (!newCondition.trim()) return
    setEditData(prev => ({
      ...prev,
      conditions: [...(prev.conditions || []), newCondition.trim()]
    }))
    setNewCondition('')
  }

  const removeCondition = (index) => {
    setEditData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }))
  }

  const addAllergy = () => {
    if (!newAllergy.trim()) return
    setEditData(prev => ({
      ...prev,
      allergies: [...(prev.allergies || []), newAllergy.trim()]
    }))
    setNewAllergy('')
  }

  const removeAllergy = (index) => {
    setEditData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }))
  }

  if (loading || !user) {
    return <div className="page" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading profile...</div>
  }

  const data = isEditing ? editData : user

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your personal health details.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isEditing ? (
            <>
              <button className="btn-secondary" onClick={cancelEdit}>
                <X size={16} /> Cancel
              </button>
              <button className="btn-primary" onClick={handleSave}>
                <Save size={16} /> Save Changes
              </button>
            </>
          ) : (
            <button className="btn-secondary" onClick={startEdit}>
              <Edit3 size={16} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="profile-card animate-slide-up">
        <div className="profile-avatar">{data.name?.[0]?.toUpperCase() || 'U'}</div>
        <div className="profile-info" style={{ flex: 1 }}>
          {isEditing ? (
            <input
              value={editData.name}
              onChange={e => setEditData({ ...editData, name: e.target.value })}
              className="form-input"
              style={{ maxWidth: '320px', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 600 }}
            />
          ) : (
            <h2>{data.name}</h2>
          )}

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Age:</span>
                <input
                  type="number"
                  min="0"
                  max="150"
                  value={editData.age || ''}
                  onChange={e => setEditData({ ...editData, age: e.target.value })}
                  className="form-input"
                  style={{ width: '70px', padding: '0.3rem 0.5rem' }}
                />
              </div>
            ) : (
              <p><strong>Age:</strong> {data.age} yrs</p>
            )}

            {isEditing ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Blood:</span>
                <select
                  value={editData.blood || ''}
                  onChange={e => setEditData({ ...editData, blood: e.target.value })}
                  className="form-input"
                  style={{ width: '80px', padding: '0.3rem 0.5rem' }}
                >
                  <option value="">—</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            ) : (
              <p><strong>Blood Group:</strong> <span className="badge success">{data.blood}</span></p>
            )}
          </div>

          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={15} color="var(--text-muted)" />
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email || ''}
                  onChange={e => setEditData({ ...editData, email: e.target.value })}
                  className="form-input"
                  style={{ maxWidth: '280px' }}
                  placeholder="email@example.com"
                />
              ) : (
                data.email
              )}
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={15} color="var(--text-muted)" />
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone || ''}
                  onChange={e => setEditData({ ...editData, phone: e.target.value })}
                  className="form-input"
                  style={{ maxWidth: '200px' }}
                  placeholder="+91 XXXXX XXXXX"
                />
              ) : (
                data.phone
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
            {data.conditions && data.conditions.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'var(--warning-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 500 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--warning)', flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{c}</span>
                {isEditing && (
                  <button onClick={() => removeCondition(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '0.1rem' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add condition"
                  value={newCondition}
                  onChange={e => setNewCondition(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                  style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                />
                <button className="btn-primary" onClick={addCondition} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}>
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card animate-slide-up" style={{ borderTop: '3px solid var(--danger)', animationDelay: '0.15s' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle size={18} color="var(--danger)" /> Known Allergies
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {data.allergies && data.allergies.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'var(--danger-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 500, color: 'var(--danger)' }}>
                <AlertTriangle size={14} />
                <span style={{ flex: 1 }}>{a}</span>
                {isEditing && (
                  <button onClick={() => removeAllergy(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '0.1rem' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add allergy"
                  value={newAllergy}
                  onChange={e => setNewAllergy(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                  style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                />
                <button className="btn-primary" onClick={addAllergy} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}>
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
