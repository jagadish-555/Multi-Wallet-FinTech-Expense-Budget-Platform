import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useToastStore, type Toast } from '@/store/toast.store'

const ICON_MAP = {
  success: <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />,
  error:   <XCircle   size={16} style={{ color: 'var(--danger)',  flexShrink: 0 }} />,
  info:    <Info      size={16} style={{ color: 'var(--info)',    flexShrink: 0 }} />,
}

const ACCENT_COLOR: Record<Toast['type'], string> = {
  success: 'var(--success)',
  error:   'var(--danger)',
  info:    'var(--info)',
}

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 16px',
        minWidth: '280px',
        maxWidth: '360px',
        boxShadow: 'var(--shadow-elevated)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'toast-in 0.25s ease',
      }}
    >
      {/* Left accent stripe */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          backgroundColor: ACCENT_COLOR[toast.type],
        }}
      />

      {/* Offset for stripe */}
      <div style={{ marginLeft: '4px', display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        {ICON_MAP[toast.type]}
        <p
          style={{
            flex: 1,
            fontFamily: "'Sora', sans-serif",
            fontSize: '14px',
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {toast.message}
        </p>
        <button
          onClick={() => removeToast(toast.id)}
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.15s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-tertiary)' }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}
