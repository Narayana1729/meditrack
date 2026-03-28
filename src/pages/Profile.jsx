import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient';

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
        setUser(fallbackUser);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1).single();
        if (error) {
           // Wait and see if it's just empty or an actual error
           throw error;
        }
        if (data) {
           // Parse JSON strings back to arrays if needed from Supabase
           data.conditions = typeof data.conditions === 'string' ? JSON.parse(data.conditions) : data.conditions;
           data.allergies = typeof data.allergies === 'string' ? JSON.parse(data.allergies) : data.allergies;
           setUser(data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err.message);
        setUser(fallbackUser); // Fallback if no table exists yet
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsEditing(false);
    
    if (supabase) {
      try {
        // Assume ID 1 for MVP if no auth
        const updateData = { ...user };
        const { error } = await supabase.from('profiles').upsert([{ id: 1, ...updateData }]);
        if (error) throw error;
      } catch (err) {
        console.error('Error saving profile:', err.message);
      }
    }
  }

  if (loading || !user) {
    return <div style={{ textAlign:'center', padding:'3rem'}}>Loading profile...</div>
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">👤 My Profile</h1>
          <p className="page-subtitle">Manage your personal health details.</p>
        </div>
        <button 
          className={isEditing ? "btn-primary" : "btn-secondary"} 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          style={{ marginBottom: '1.5rem' }}
        >
          {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
        </button>
      </div>

      <div className="profile-card glass-card animate-slide-up" style={{ display:'flex', gap:'2rem', padding:'2rem', borderTop: '4px solid var(--primary)', borderRadius: 'var(--radius-lg)' }}>
        <div className="profile-avatar" style={{width:'5rem', height:'5rem', fontSize:'2rem'}}>{user.name[0]}</div>
        <div className="profile-info" style={{flex:1}}>
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
            {isEditing ? (
               <input type="number" value={user.age} onChange={e=>setUser({...user, age: e.target.value})} className="form-input" style={{width:'80px', padding:'0.2rem'}}/>
            ) : <p><strong>Age:</strong> {user.age} yrs</p>}
            
            {isEditing ? (
               <input value={user.blood} onChange={e=>setUser({...user, blood: e.target.value})} className="form-input" style={{width:'80px', padding:'0.2rem'}}/>
            ) : <p><strong>Blood Group:</strong> <span className="badge success">{user.blood}</span></p>}
          </div>
          
          <div style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <p>📧 {isEditing ? <input value={user.email} onChange={e=>setUser({...user, email:e.target.value})} className="form-input"/> : user.email}</p>
            <p>📞 {isEditing ? <input value={user.phone} onChange={e=>setUser({...user, phone:e.target.value})} className="form-input"/> : user.phone}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="placeholder-box glass-card animate-slide-up" style={{ borderTop: '4px solid var(--warning)', padding: '1.5rem', animationDelay:'0.1s' }}>
          <h3>🩺 Chronic Conditions</h3>
          <ul style={{ lineHeight: '1.8', marginTop:'1rem' }}>
            {user.conditions && user.conditions.map((c, i) => (
              <li key={i} style={{listStyle:'inside'}}>{c}</li>
            ))}
          </ul>
        </div>

        <div className="placeholder-box glass-card animate-slide-up" style={{ borderTop: '4px solid var(--danger)', padding: '1.5rem', animationDelay:'0.2s' }}>
          <h3>⚠️ Known Allergies</h3>
          <ul style={{ lineHeight: '1.8', marginTop:'1rem' }}>
            {user.allergies && user.allergies.map((a, i) => (
               <li key={i} style={{color:'var(--danger)', listStyle:'inside'}}>{a}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
