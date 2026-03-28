export default function Reports() {
  const reports = [
    { id: 1, title: 'Blood Sugar Trend', period: 'March 2026', status: 'Ready' },
    { id: 2, title: 'Cholesterol Analysis', period: 'Feb 2026', status: 'Ready' },
    { id: 3, title: 'Annual Health Summary', period: '2025', status: 'Processing' },
  ]

  return (
    <div className="page">
      <h1 className="page-title">📊 Reports</h1>
      <p className="page-subtitle">View and download your health reports.</p>

      <div className="cards-grid">
        {reports.map(r => (
          <div className="report-card" key={r.id}>
            <h3>{r.title}</h3>
            <p>Period: {r.period}</p>
            <span className={`badge ${r.status === 'Ready' ? 'confirmed' : 'pending'}`}>{r.status}</span>
            <button className="btn-primary" disabled={r.status !== 'Ready'}>
              📥 Download
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
