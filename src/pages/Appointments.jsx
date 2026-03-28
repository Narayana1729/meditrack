export default function Appointments() {
  const appointments = [
    { id: 1, doctor: 'Dr. Priya Sharma', specialty: 'Cardiology', date: '2026-04-02', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, doctor: 'Dr. Arjun Nair', specialty: 'Dermatology', date: '2026-04-05', time: '2:30 PM', status: 'Pending' },
    { id: 3, doctor: 'Dr. Lakshmi Rao', specialty: 'Neurology', date: '2026-04-10', time: '11:00 AM', status: 'Confirmed' },
  ]

  return (
    <div className="page">
      <h1 className="page-title">📅 Appointments</h1>
      <p className="page-subtitle">Manage your upcoming doctor visits.</p>

      <button className="btn-primary">+ Book New Appointment</button>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Specialty</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id}>
                <td>{a.doctor}</td>
                <td>{a.specialty}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>
                  <span className={`badge ${a.status.toLowerCase()}`}>{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
