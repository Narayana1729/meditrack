export default function Profile() {
  const user = {
    name: 'Srimannarayana Deevi',
    age: 22,
    blood: 'O+',
    email: 'narayana@meditrack.app',
    phone: '+91 98765 43210',
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    allergies: ['Penicillin'],
  }

  return (
    <div className="page">
      <h1 className="page-title">👤 My Profile</h1>
      <p className="page-subtitle">Your personal health details.</p>

      <div className="profile-card">
        <div className="profile-avatar">{user.name[0]}</div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>Age: {user.age} · Blood Group: {user.blood}</p>
          <p>📧 {user.email}</p>
          <p>📞 {user.phone}</p>
        </div>
      </div>

      <div className="placeholder-box">
        <h3>🩺 Conditions</h3>
        <ul>{user.conditions.map(c => <li key={c}>{c}</li>)}</ul>
      </div>

      <div className="placeholder-box">
        <h3>⚠️ Allergies</h3>
        <ul>{user.allergies.map(a => <li key={a}>{a}</li>)}</ul>
      </div>

      <button className="btn-primary">✏️ Edit Profile</button>
    </div>
  )
}
