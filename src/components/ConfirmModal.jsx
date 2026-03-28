import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmModal({ title, message, onConfirm, onCancel, confirmText = 'Confirm', danger = false }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {danger && <AlertTriangle size={20} color="var(--danger)" />}
            {title}
          </h2>
          <button
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            onClick={onCancel}
          >
            <X size={22} />
          </button>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{message}</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button
            className={danger ? 'btn-danger' : 'btn-primary'}
            onClick={onConfirm}
            style={danger ? { padding: '0.65rem 1.3rem', fontWeight: 600, fontSize: '0.9rem' } : {}}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
