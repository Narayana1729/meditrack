import { useState } from 'react';
import { FileText, FileImage, Download, Trash2, Plus, X } from 'lucide-react';

const initialRecords = [
  { id: 1, type: 'Blood Test', date: '2026-03-15', doctor: 'Dr. Priya Sharma', file: 'blood_test_march.pdf', fileType: 'pdf' },
  { id: 2, type: 'X-Ray', date: '2026-02-10', doctor: 'Dr. Rahul Mehta', file: 'xray_feb.jpg', fileType: 'img' },
  { id: 3, type: 'ECG', date: '2026-01-22', doctor: 'Dr. Arjun Nair', file: 'ecg_jan.pdf', fileType: 'pdf' },
];

export default function HealthRecords() {
  const [records, setRecords] = useState(initialRecords);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDoctor, setNewDoctor] = useState('');
  const [newFile, setNewFile] = useState('');

  const handleDelete = (id) => {
    setRecords(records.filter(r => r.id !== id));
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!newTitle || !newDoctor || !newFile) return;

    const newRecord = {
      id: Date.now(),
      type: newTitle,
      date: new Date().toISOString().split('T')[0],
      doctor: newDoctor,
      file: newFile.name || 'document.pdf',
      fileType: newFile.name?.endsWith('jpg') || newFile.name?.endsWith('png') ? 'img' : 'pdf'
    };

    setRecords([newRecord, ...records]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDoctor('');
    setNewFile('');
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
        <div>
          <h1 className="page-title">Health Records</h1>
          <p className="page-subtitle">Securely manage your medical history.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Upload Record
        </button>
      </div>

      {records.length === 0 ? (
        <div className="empty-state animate-slide-up glass-card">
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
                <tr key={r.id} style={{ animation: `fadeIn 0.3s ease ${i * 0.1}s forwards`, opacity: 0 }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                      {r.fileType === 'pdf' ? <FileText size={18} color="var(--primary)" /> : <FileImage size={18} color="var(--secondary)" />}
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
                        style={{ padding: '0.4rem', border: 'none', background: 'transparent' }} 
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Upload New Record</h2>
              <button 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} 
                onClick={() => setIsModalOpen(false)}
              >
                <X size={24} />
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
                <button type="submit" className="btn-primary">Upload Document</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
