import { useState, useEffect } from 'react';
import { Search, MapPin, Star, CalendarCheck, Clock, X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useToast } from '../components/Toast';

const fallbackDoctors = [
  { id: 1, name: 'Dr. Priya Sharma', specialty: 'Cardiology', rating: 4.8, location: 'Hyderabad', available: true },
  { id: 2, name: 'Dr. Arjun Nair', specialty: 'Dermatology', rating: 4.5, location: 'Bangalore', available: false },
  { id: 3, name: 'Dr. Lakshmi Rao', specialty: 'Neurology', rating: 4.9, location: 'Chennai', available: true },
  { id: 4, name: 'Dr. Rahul Mehta', specialty: 'Orthopedics', rating: 4.3, location: 'Mumbai', available: true },
  { id: 5, name: 'Dr. Anjali Gupta', specialty: 'Cardiology', rating: 4.7, location: 'Delhi', available: true },
  { id: 6, name: 'Dr. Vikram Singh', specialty: 'Pediatrics', rating: 4.6, location: 'Pune', available: false },
];

const specialties = ['All', 'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics'];

export default function DoctorSearch() {
  const { addToast } = useToast();
  const [query, setQuery] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState('All');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingDoctor, setBookingDoctor] = useState(null); // doctor object for booking modal
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchDoctors() {
      if (!supabase) {
        setDoctors(fallbackDoctors);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from('doctors').select('*');
        if (error) throw error;
        setDoctors(data?.length ? data : fallbackDoctors);
      } catch (err) {
        console.error('Error fetching doctors:', err.message);
        addToast('Failed to load doctors. Using offline data.', 'warning');
        setDoctors(fallbackDoctors);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDoctor || !bookDate || !bookTime) return;

    setIsSubmitting(true);

    const newAppt = {
      doctor: bookingDoctor.name,
      specialty: bookingDoctor.specialty,
      date: bookDate,
      time: bookTime,
      status: 'Pending',
    };

    if (supabase) {
      try {
        const { error } = await supabase.from('appointments').insert([newAppt]);
        if (error) throw error;
        addToast(`Appointment booked with ${bookingDoctor.name}!`, 'success');
      } catch (err) {
        console.error('Error creating appointment:', err.message);
        addToast('Failed to book appointment. Please try again.', 'error');
        setIsSubmitting(false);
        return;
      }
    } else {
      addToast(`Appointment booked with ${bookingDoctor.name} (offline).`, 'success');
    }

    setBookingDoctor(null);
    setBookDate('');
    setBookTime('');
    setIsSubmitting(false);
  };

  const filtered = doctors.filter(d => {
    const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase()) || 
                         d.specialty.toLowerCase().includes(query.toLowerCase());
    const matchesSpecialty = activeSpecialty === 'All' || d.specialty === activeSpecialty;
    return matchesQuery && matchesSpecialty;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Find a Doctor</h1>
        <p className="page-subtitle">Search, filter, and book appointments instantly.</p>
        {!supabase && <p style={{color:'var(--warning)', marginTop:'0.5rem', fontSize:'0.9rem'}}>⚠️ Disconnected from Database. Using offline mode.</p>}
      </div>

      <div className="search-wrapper animate-slide-up">
        <Search className="search-icon" size={20} />
        <input
          className="search-input"
          type="text"
          placeholder="Search by name, specialty, or condition..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="filters animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {specialties.map(spec => (
          <button
            key={spec}
            className={`filter-chip ${activeSpecialty === spec ? 'active' : ''}`}
            onClick={() => setActiveSpecialty(spec)}
          >
            {spec}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading doctors...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Search size={48} />
          <h2>No doctors found</h2>
          <p>Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filtered.map((doc, index) => (
            <DoctorCard 
              key={doc.id} 
              doc={doc} 
              index={index} 
              onBook={() => setBookingDoctor(doc)} 
            />
          ))}
        </div>
      )}

      {/* Booking Modal - creates a real appointment */}
      {bookingDoctor && (
        <div className="modal-overlay" onClick={() => setBookingDoctor(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Appointment</h2>
              <button
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setBookingDoctor(null)}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', padding: '0.75rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
              <div className="doctor-avatar">{bookingDoctor.name?.split(' ').pop()?.[0] || '?'}</div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{bookingDoctor.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{bookingDoctor.specialty} · {bookingDoctor.location}</p>
              </div>
            </div>

            <form onSubmit={handleBookSubmit}>
              <div className="form-group">
                <label className="form-label">Appointment Date</label>
                <input type="date" className="form-input" value={bookDate} onChange={e => setBookDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Time</label>
                <input type="time" className="form-input" value={bookTime} onChange={e => setBookTime(e.target.value)} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setBookingDoctor(null)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  <CalendarCheck size={16} />
                  {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function DoctorCard({ doc, index, onBook }) {
  const getAvatar = (name) => {
    if (!name) return '?';
    const parts = name.split(' ').filter(Boolean);
    return parts.length > 1 ? parts[parts.length - 1][0] : parts[0][0];
  };

  return (
    <div 
      className="glass-card doctor-card animate-slide-up" 
      style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}
    >
      <div className="doctor-header">
        <div className="doctor-avatar">{getAvatar(doc.name)}</div>
        <div className="doctor-info">
          <h3>{doc.name}</h3>
          <p><MapPin size={14} /> {doc.location}</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="badge neutral">{doc.specialty}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 600 }}>
          <Star size={16} fill="#F59E0B" color="#F59E0B" /> {doc.rating}
        </span>
      </div>
      
      <div style={{ padding: '10px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <span className={`badge ${doc.available ? 'success' : 'warning'}`}>
          {doc.available ? (
            <><CalendarCheck size={14} /> Available Today</>
          ) : (
            <><Clock size={14} /> Currently Unavailable</>
          )}
        </span>
      </div>
      
      <button 
        className="btn-primary" 
        disabled={!doc.available}
        onClick={onBook}
        style={{ width: '100%', marginTop: 'auto' }}
      >
        {!doc.available ? 'Unavailable' : 'Book Appointment'}
      </button>
    </div>
  );
}
