import { useState, useEffect } from 'react';
import { Search, MapPin, Star, CalendarCheck, Clock } from 'lucide-react';
import { supabase } from '../supabaseClient';

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
  const [query, setQuery] = useState('');
  const [activeSpecialty, setActiveSpecialty] = useState('All');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    async function fetchDoctors() {
      if (!supabase) {
        console.warn("Supabase keys missing. Using fallback data.");
        setDoctors(fallbackDoctors);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from('doctors').select('*');
        if (error) throw error;
        setDoctors(data || fallbackDoctors);
      } catch (err) {
        console.error('Error fetching doctors:', err.message);
        setDoctors(fallbackDoctors);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  const handleBook = async (id) => {
    setBookingId(id);
    
    if (supabase) {
      try {
        const { error } = await supabase
          .from('doctors')
          .update({ available: false })
          .eq('id', id);
          
        if (error) throw error;
        
        // If Supabase update succeeds, explicitly update the local state.
        setDoctors(docs => docs.map(d => d.id === id ? { ...d, available: false } : d));
        
      } catch (err) {
        console.error('Error updating doctor booking:', err.message);
        alert('Could not book appointment. Please check your connection.');
      } finally {
        setBookingId(null);
      }
    } else {
      // Offline fallback
      setTimeout(() => {
        setDoctors(docs => docs.map(d => d.id === id ? { ...d, available: false } : d));
        setBookingId(null);
      }, 1000);
    }
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
        {!supabase && <p style={{color:'var(--warning)', marginTop:'1rem', fontSize:'0.9rem'}}>⚠️ Disconnected from Database. Using offline mode.</p>}
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
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading doctors...</div>
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
              isBooking={bookingId === doc.id} 
              onBook={() => handleBook(doc.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DoctorCard({ doc, index, isBooking, onBook }) {
  // Safe Avatar Extraction
  const getAvatar = (name) => {
    if (!name) return '?';
    const parts = name.split(' ').filter(Boolean);
    // If they have a first and last name, attempt to take the first letter of last name, otherwise first name.
    return parts.length > 1 ? parts[1][0] : parts[0][0];
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
            <><Clock size={14} /> Next available in 2 days</>
          )}
        </span>
      </div>
      
      <button 
        className="btn-primary" 
        disabled={!doc.available || isBooking}
        onClick={onBook}
        style={{ width: '100%', marginTop: 'auto' }}
      >
        {isBooking ? 'Booking...' : (!doc.available ? 'Unavailable' : 'Book Appointment')}
      </button>
    </div>
  );
}
