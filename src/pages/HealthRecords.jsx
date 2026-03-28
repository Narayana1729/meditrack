import { useState, useEffect } from 'react';
import { FileText, FileImage, Download, Trash2, Plus, X } from 'lucide-react';
import { supabase } from '../supabaseClient';

const fallbackRecords = [
  { id: 1, type: 'Blood Test', date: '2026-03-15', doctor: 'Dr. Priya Sharma', file: 'blood_test_march.pdf', file_type: 'pdf' },
  { id: 2, type: 'X-Ray', date: '2026-02-10', doctor: 'Dr. Rahul Mehta', file: 'xray_feb.jpg', file_type: 'img' },
  { id: 3, type: 'ECG', date: '2026-01-22', doctor: 'Dr. Arjun Nair', file: 'ecg_jan.pdf', file_type: 'pdf' },
];

export default function HealthRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDoctor, setNewDoctor] = useState('');
  const [newFile, setNewFile] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function fetchRecords() {
      if (!supabase) {
        setRecords(fallbackRecords);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from('health_records').select('*').order('date', { ascending: false });
        if (error) throw error;
        setRecords(data || fallbackRecords);
      } catch (err) {
        console.error('Error fetching records:', err.message);
        setRecords(fallbackRecords);
      } finally {
        setLoading(false);
      }
    }
    fetchRecords();
  }, []);

  const handleDelete = async (id) => {
    if (supabase) {
      try {
        const { error } = await supabase.from('health_records').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Error deleting record:', err.message);
      }
    }
    setRecords(records.filter(r => r.id !== id));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newTitle || !newDoctor || !newFile) return;

    setIsUploading(true);
    const fileExtension = newFile.name?.split('.').pop();
    const fileType = ['jpg', 'png', 'jpeg'].includes(fileExtension?.toLowerCase()) ? 'img' : 'pdf';
    
    const newRecordObj = {
      type: newTitle,
      date: new Date().toISOString().split('T')[0],
      doctor: newDoctor,
      file: newFile.name || 'document.pdf',
      file_type: fileType
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('health_records')
          .insert([newRecordObj])
          .select();
        
        if (error) throw error;
        if (data && data.length > 0) newRecordObj.id = data[0].id;
      } catch (err) {
        console.error('Error uploading record to Supabase:', err.message);
        newRecordObj.id = Date.now();
      }
    } else {
      newRecordObj.id = Date.now();
    }

    setRecords([newRecordObj, ...records]);
    setNewTitle('');
    setNewDoctor('');
    setNewFile('');
    setIsUploading(false);
    setIsModalOpen(false);
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">Health Records</h1>
          <p className="page-subtitle">Securely manage your medical history.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Upload Record
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading records...</div>
      ) : records.length === 0 ? (
        <div className="empty-state animate-slide-up card" style={{ background: 'var(--surface)' }}>
          <FileText size={48} />
          <h2>No records found</h2>
          <p>You haven't uploaded any health records yet.</p>
          <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setIsModalOpen(true)}>
            Upload First Record
          </button>
        </div>
      ) : (
        <div className="table-wrapper animate-slide-up">
          <table className="data-table">
            <thead>
              <tr>
                <th>Document Type</th>
                <th>Date Added</th>
                <th>Provider / Doctor</th>
                <th>File</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                      {r.file_type === 'pdf' ? <FileText size={18} color="var(--primary)" /> : <FileImage size={18} color="var(--secondary)" />}
                      {r.type}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{new Date(r.date).toLocaleDateString()}</td>
                  <td>{r.doctor}</td>
                  <td>
                    <a href="#" className="file-link" onClick={(e) => e.preventDefault()}>
                      {r.file}
                    </a>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button className="btn-secondary" style={{ padding: '0.4rem', border: 'none', background: 'transparent' }} title="Download">
                        <Download size={18} color="var(--text-muted)" />
                      </button>
                      <button
                        className="btn-danger"
                        style={{ padding: '0.4rem' }}
                        title="Delete"
                        onClick={() => handleDelete(r.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Upload New Record</h2>
              <button
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                onClick={() => setIsModalOpen(false)}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label className="form-label">Document Type / Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Annual Blood Work"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Issuing Doctor</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dr. John Doe"
                  value={newDoctor}
                  onChange={e => setNewDoctor(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Select File</label>
                <input
                  type="file"
                  className="form-input"
                  onChange={e => setNewFile(e.target.files[0])}
                  required
                />
                {newFile && <p style={{ fontSize: '0.85rem', color: 'var(--success)', marginTop: '0.5rem' }}>✓ File selected: {newFile.name}</p>}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
