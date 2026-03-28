import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from 'lucide-react'

const ToastContext = createContext(null)

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const colors = {
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#0EA5E9',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, toast.duration)
    return () => clearTimeout(timer)
  }, [toast.duration, onDismiss])

  const Icon = icons[toast.type] || Info
  const color = colors[toast.type] || colors.info

  return (
    <div className={`toast toast-${toast.type}`} style={{ '--toast-color': color }}>
      <Icon size={18} color={color} />
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={onDismiss}>
        <X size={14} />
      </button>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
