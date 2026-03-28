import { useState, useEffect } from 'react';
import { FileText, FileImage, Download, Trash2, Plus, X } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

const fallbackRecords = [
  { id: 1, type: 'Blood Test', date: '2026-03-15', doctor: 'Dr. Priya Sharma', file: 'blood_test_march.pdf', file_type: 'pdf' },
  { id: 2, type: 'X-Ray', date: '2026-02-10', doctor: 'Dr. Rahul Mehta', file: 'xray_feb.jpg', file_type: 'img' },
  { id: 3, type: 'ECG', date: '2026-01-22', doctor: 'Dr. Arjun Nair', file: 'ecg_jan.pdf', file_type: 'pdf' },
];

export default function HealthRecords() {
  const { addToast } = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDoctor, setNewDoctor] = useState('');
  const [newFile, setNewFile] = useState(null);
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
        setRecords(data?.length ? data : fallbackRecords);
      } catch (err) {
        console.error('Error fetching records:', err.message);
        addToast('Failed to load records. Using offline data.', 'warning');
        setRecords(fallbackRecords);
      } finally {
        setLoading(false);
      }
    }
    fetchRecords();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget;

    if (supabase) {
      try {
        const { error } = await supabase.from('health_records').delete().eq('id', id);
        if (error) throw error;
        addToast('Record deleted successfully.', 'success');
      } catch (err) {
        console.error('Error deleting record:', err.message);
        addToast('Failed to delete record.', 'error');
        setDeleteTarget(null);
        return;
      }
    } else {
      addToast('Record deleted (offline mode).', 'success');
    }

    setRecords(prev => prev.filter(r => r.id !== id));
    setDeleteTarget(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newTitle || !newDoctor || !newFile) return;

    setIsUploading(true);
    const fileExtension = newFile.name?.split('.').pop();
    const fileType = ['jpg', 'png', 'jpeg', 'gif', 'webp'].includes(fileExtension?.toLowerCase()) ? 'img' : 'pdf';
    
    let storedFileName = newFile.name || 'document.pdf';
    let fileUrl = null;

    // Attempt actual file upload to Supabase Storage
    if (supabase) {
      try {
        const safeName = `${Date.now()}_${newFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('health-records')
          .upload(safeName, newFile);

        if (uploadError) {
          // Storage bucket may not exist — fall back to just metadata
          console.warn('File upload skipped (storage bucket may not exist):', uploadError.message);
          addToast('File saved as metadata only. Set up Supabase Storage for full uploads.', 'info');
        } else {
          // Get public URL
          const { data: urlData } = supabase.storage.from('health-records').getPublicUrl(safeName);
          fileUrl = urlData?.publicUrl || null;
          storedFileName = safeName;
        }
      } catch (err) {
        console.warn('Storage upload failed:', err.message);
      }
    }

    const newRecordObj = {
      type: newTitle,
      date: new Date().toISOString().split('T')[0],
      doctor: newDoctor,
      file: fileUrl || storedFileName,
      file_type: fileType,
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('health_records')
          .insert([newRecordObj])
          .select();
        
        if (error) throw error;
        if (data && data.length > 0) newRecordObj.id = data[0].id;
        addToast('Record uploaded successfully!', 'success');
      } catch (err) {
        console.error('Error uploading record:', err.message);
        addToast('Failed to save record to database.', 'error');
        newRecordObj.id = Date.now();
      }
    } else {
      newRecordObj.id = Date.now();
      addToast('Record saved (offline mode).', 'success');
    }

    setRecords(prev => [newRecordObj, ...prev]);
    setNewTitle('');
    setNewDoctor('');
    setNewFile(null);
    setIsUploading(false);
    setIsModalOpen(false);
  };

  const handleDownload = (record) => {
    if (record.file?.startsWith('http')) {
      window.open(record.file, '_blank');
    } else {
      addToast('Download not available. File was saved as metadata only.', 'info');
    }
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
                    {r.file?.startsWith('http') ? (
                      <a href={r.file} target="_blank" rel="noopener noreferrer" className="file-link">
                        {r.file.split('/').pop()}
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{r.file}</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: '0.4rem', border: 'none', background: 'transparent' }}
                        title="Download"
                        onClick={() => handleDownload(r)}
                      >
                        <Download size={18} color="var(--text-muted)" />
                      </button>
                      <button
                        className="btn-danger"
                        style={{ padding: '0.4rem' }}
                        title="Delete"
                        onClick={() => setDeleteTarget(r.id)}
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
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
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
                  placeholder="e.g. Dr. Priya Sharma"
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
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                  onChange={e => setNewFile(e.target.files?.[0] || null)}
                  required
                />
                {newFile && <p style={{ fontSize: '0.85rem', color: 'var(--success)', marginTop: '0.5rem' }}>✓ File selected: {newFile.name} ({(newFile.size / 1024).toFixed(1)} KB)</p>}
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Record"
          message="Are you sure you want to delete this health record? This action cannot be undone."
          confirmText="Delete"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
