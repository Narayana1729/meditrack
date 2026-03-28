import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import DoctorSearch from './pages/DoctorSearch'
import HealthRecords from './pages/HealthRecords'
import MedicineReminder from './pages/MedicineReminder'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import Reports from './pages/Reports'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/doctor-search" element={<DoctorSearch />} />
          <Route path="/health-records" element={<HealthRecords />} />
          <Route path="/medicine-reminder" element={<MedicineReminder />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
