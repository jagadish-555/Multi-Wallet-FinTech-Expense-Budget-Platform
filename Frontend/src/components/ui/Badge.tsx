type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'accent'

interface BadgeProps {
  variant?: Variant
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const VARIANT_STYLES: Record<Variant, React.CSSProperties> = {
  success: {
    backgroundColor: 'var(--success-dim)',
    color: 'var(--success)',
    border: '1px solid rgba(34,197,94,0.2)',
  },
  warning: {
    backgroundColor: 'var(--warning-dim)',
    color: 'var(--warning)',
    border: '1px solid rgba(245,158,11,0.2)',
  },
  danger: {
    backgroundColor: 'var(--danger-dim)',
    color: 'var(--danger)',
    border: '1px solid rgba(239,68,68,0.2)',
  },
  info: {
    backgroundColor: 'var(--info-dim)',
    color: 'var(--info)',
    border: '1px solid rgba(96,165,250,0.2)',
  },
  neutral: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
  },
  accent: {
    backgroundColor: 'var(--accent-subtle)',
    color: 'var(--accent)',
    border: '1px solid var(--border-accent)',
  },
}

export default function Badge({ variant = 'neutral', children, className, style }: BadgeProps) {
  return (
    <span
      className={className}
      style={{
        borderRadius: 'var(--radius-full)',
        fontSize: '11px',
        fontWeight: 600,
        fontFamily: "'Sora', sans-serif",
        padding: '3px 10px',
        letterSpacing: '0.03em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        ...VARIANT_STYLES[variant],
        ...style,
      }}
    >
      {children}
    </span>
  )
}
