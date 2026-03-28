export default function HealthRecords() {
  const records = [
    { id: 1, type: 'Blood Test', date: '2026-03-15', doctor: 'Dr. Priya Sharma', file: 'blood_test_march.pdf' },
    { id: 2, type: 'X-Ray', date: '2026-02-10', doctor: 'Dr. Rahul Mehta', file: 'xray_feb.pdf' },
    { id: 3, type: 'ECG', date: '2026-01-22', doctor: 'Dr. Arjun Nair', file: 'ecg_jan.pdf' },
  ]

  return (
    <div className="page">
      <h1 className="page-title">📋 Health Records</h1>
      <p className="page-subtitle">All your medical documents in one place.</p>

      <button className="btn-primary">+ Upload Record</button>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Date</th>
              <th>Doctor</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id}>
                <td>{r.type}</td>
                <td>{r.date}</td>
                <td>{r.doctor}</td>
                <td><a href="#" className="link">{r.file}</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
