import { useState, useEffect } from 'react'
import { FileText, TrendingUp, TrendingDown, Minus, Download, Calendar } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { useToast } from '../components/Toast'

const fallbackReports = [
  { id: 1, title: 'Blood Sugar Trend', period: 'March 2026', status: 'Ready', category: 'Lab Test', trend: 'stable' },
  { id: 2, title: 'Cholesterol Analysis', period: 'Feb 2026', status: 'Ready', category: 'Lab Test', trend: 'down' },
  { id: 3, title: 'Annual Health Summary', period: '2025', status: 'Processing', category: 'General', trend: 'up' },
  { id: 4, title: 'ECG Analysis', period: 'Jan 2026', status: 'Ready', category: 'Cardiac', trend: 'stable' },
  { id: 5, title: 'Thyroid Panel', period: 'March 2026', status: 'Processing', category: 'Lab Test', trend: 'up' },
  { id: 6, title: 'Vitamin D Levels', period: 'Feb 2026', status: 'Ready', category: 'Lab Test', trend: 'down' },
]

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
}

const trendColors = {
  up: '#10B981',
  down: '#EF4444',
  stable: '#64748B',
}

const categoryColors = {
  'Lab Test': { bg: 'rgba(79,70,229,0.1)', color: '#4F46E5' },
  'General': { bg: 'rgba(14,165,233,0.1)', color: '#0EA5E9' },
  'Cardiac': { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' },
}

export default function Reports() {
  const { addToast } = useToast()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReports() {
      if (!supabase) {
        setReports(fallbackReports)
        setLoading(false)
        return
      }
      try {
        const { data, error } = await supabase.from('reports').select('*').order('id', { ascending: true })
        if (error) throw error
        setReports(data?.length ? data : fallbackReports)
      } catch {
        setReports(fallbackReports)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  const handleDownload = (report) => {
    if (report.status !== 'Ready') {
      addToast('This report is still being processed.', 'info')
      return
    }

    if (report.file_url) {
      window.open(report.file_url, '_blank')
      addToast(`Downloading ${report.title}...`, 'success')
    } else {
      // Generate a text summary as downloadable content
      const content = `MediTrack Health Report\n${'='.repeat(40)}\n\nTitle: ${report.title}\nPeriod: ${report.period}\nCategory: ${report.category}\nTrend: ${report.trend === 'up' ? 'Improving' : report.trend === 'down' ? 'Needs Attention' : 'Stable'}\nStatus: ${report.status}\n\nGenerated on: ${new Date().toLocaleString()}\n\nNote: This is a summary report. Full detailed reports will be available when connected to your healthcare provider's system.`
      
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${report.title.replace(/\s+/g, '_')}_${report.period.replace(/\s+/g, '_')}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      addToast(`Downloaded summary for ${report.title}.`, 'success')
    }
  }

  const readyCount = reports.filter(r => r.status === 'Ready').length
  const processingCount = reports.filter(r => r.status === 'Processing').length

  if (loading) {
    return <div className="page" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading reports...</div>
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">View and download your health reports.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="badge success" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
            {readyCount} Ready
          </div>
          <div className="badge warning" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
            {processingCount} Processing
          </div>
        </div>
      </div>

      <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {reports.map((r, i) => {
          const TrendIcon = trendIcons[r.trend] || Minus
          const tColor = trendColors[r.trend] || '#64748B'
          const cat = categoryColors[r.category] || { bg: 'rgba(100,116,139,0.1)', color: '#64748B' }

          return (
            <div className="report-card animate-slide-up" key={r.id} style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="report-card-header">
                <div className="report-icon-wrap" style={{ background: cat.bg, color: cat.color }}>
                  <FileText size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.15rem' }}>{r.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={13} /> {r.period}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge neutral">{r.category}</span>
                  <span className={`badge ${r.status === 'Ready' ? 'success' : 'warning'}`}>{r.status}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: tColor, fontSize: '0.82rem', fontWeight: 600 }}>
                  <TrendIcon size={16} />
                  {r.trend === 'up' ? 'Improving' : r.trend === 'down' ? 'Needs Attention' : 'Stable'}
                </div>
              </div>

              <button
                className="btn-primary"
                disabled={r.status !== 'Ready'}
                style={{ width: '100%', marginTop: '0.5rem' }}
                onClick={() => handleDownload(r)}
              >
                <Download size={16} />
                {r.status === 'Ready' ? 'Download Report' : 'Processing...'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
