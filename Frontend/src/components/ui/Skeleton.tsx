interface SkeletonProps {
  className?: string
  variant?: 'line' | 'card' | 'circle'
  style?: React.CSSProperties
}

export default function Skeleton({ className, variant = 'line', style }: SkeletonProps) {
  if (variant === 'circle') {
    return (
      <div
        className={`skeleton${className ? ' ' + className : ''}`}
        style={{ borderRadius: '50%', ...style }}
      />
    )
  }

  if (variant === 'card') {
    return (
      <div
        className={className}
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          ...style,
        }}
      >
        <div className="skeleton" style={{ height: '14px', width: '75%' }} />
        <div className="skeleton" style={{ height: '12px', width: '50%' }} />
        <div className="skeleton" style={{ height: '12px', width: '65%' }} />
      </div>
    )
  }

  return (
    <div
      className={`skeleton${className ? ' ' + className : ''}`}
      style={{ height: '16px', width: '100%', ...style }}
    />
  )
}
