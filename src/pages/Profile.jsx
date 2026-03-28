import { User, Mail, Phone, Droplet, Activity, AlertCircle, Edit2 } from 'lucide-react';

export default function Profile() {
  const user = {
    name: 'Srimannarayana Deevi',
    age: 22,
    blood: 'O+',
    email: 'narayana@meditrack.app',
    phone: '+91 98765 43210',
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    allergies: ['Penicillin', 'Dust Mites'],
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your personal health details securely.</p>
        </div>
        <button className="btn-primary">
          <Edit2 size={18} /> Edit Profile
        </button>
      </div>

      <div className="cards-grid" style={{ marginTop: '2rem' }}>
        {/* Main Info Card */}
        <div className="glass-card doctor-card animate-slide-up" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2rem' }}>
          <div className="doctor-avatar" style={{ width: '6rem', height: '6rem', fontSize: '2.5rem' }}>
            {user.name[0]}
          </div>
          <div className="doctor-info" style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{user.name}</h2>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <p><User size={16} /> {user.age} yrs old</p>
              <p><Droplet size={16} color="var(--danger)" /> {user.blood}</p>
              <p><Mail size={16} /> {user.email}</p>
              <p><Phone size={16} /> {user.phone}</p>
            </div>
          </div>
        </div>

        {/* Existing Conditions */}
        <div className="glass-card doctor-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Activity size={24} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Health Conditions</h3>
          </div>
          {user.conditions.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {user.conditions.map(c => (
                <li key={c} style={{ padding: '0.75rem', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--secondary)' }} />
                  {c}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No underlying conditions reported.</p>
          )}
        </div>

        {/* Allergies */}
        <div className="glass-card doctor-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertCircle size={24} color="var(--danger)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Known Allergies</h3>
          </div>
          {user.allergies.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {user.allergies.map(a => (
                <li key={a} style={{ padding: '0.75rem', background: '#fef2f2', color: 'var(--danger)', borderRadius: 'var(--radius-md)', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                  <AlertCircle size={16} />
                  {a}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No known allergies.</p>
          )}
        </div>
      </div>
    </div>
  );
}
