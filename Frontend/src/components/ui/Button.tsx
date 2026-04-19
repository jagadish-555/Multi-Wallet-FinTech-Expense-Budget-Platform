import { type ButtonHTMLAttributes, forwardRef } from 'react'
import Spinner from './Spinner'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const BASE = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontFamily: "'Sora', sans-serif",
  fontWeight: 600,
  fontSize: '13px',
  letterSpacing: '0.02em',
  border: 'none',
  cursor: 'pointer',
  borderRadius: 'var(--radius-md)',
  transition: 'all 0.15s ease',
  textDecoration: 'none',
} as const

const SIZE_STYLES: Record<Size, React.CSSProperties> = {
  sm: { padding: '8px 16px', fontSize: '12px' },
  md: { padding: '10px 20px', fontSize: '13px' },
  lg: { padding: '12px 24px', fontSize: '14px' },
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, children, style, ...props }, ref) => {
    const getVariantStyle = (): React.CSSProperties => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: 'var(--accent)',
            color: '#0e0f11',
            border: 'none',
          }
        case 'secondary':
          return {
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-strong)',
          }
        case 'danger':
          return {
            backgroundColor: 'var(--danger-dim)',
            color: 'var(--danger)',
            border: '1px solid rgba(239,68,68,0.2)',
          }
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid transparent',
          }
      }
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return
      const btn = e.currentTarget
      if (variant === 'primary') {
        btn.style.backgroundColor = 'var(--accent-dim)'
        btn.style.transform = 'translateY(-1px)'
        btn.style.boxShadow = '0 4px 12px rgba(245,166,35,0.3)'
      } else if (variant === 'secondary') {
        btn.style.backgroundColor = 'var(--bg-elevated)'
        btn.style.borderColor = 'var(--border-accent)'
      } else if (variant === 'ghost') {
        btn.style.backgroundColor = 'var(--bg-elevated)'
        btn.style.color = 'var(--text-primary)'
      }
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      const btn = e.currentTarget
      btn.style.backgroundColor = ''
      btn.style.transform = ''
      btn.style.boxShadow = ''
      btn.style.borderColor = ''
      btn.style.color = ''
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = 'scale(0.97)'
    }

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = ''
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={{
          ...BASE,
          ...SIZE_STYLES[size],
          ...getVariantStyle(),
          opacity: disabled || loading ? 0.5 : 1,
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          ...style,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
