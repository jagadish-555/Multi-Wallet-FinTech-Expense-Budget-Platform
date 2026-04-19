import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  wrapperClassName?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, wrapperClassName, className, id, style, ...props }, ref) => (
    <div className={`flex flex-col ${wrapperClassName ?? ''}`} style={{ gap: '6px' }}>
      {label && (
        <label htmlFor={id} className="label-dark">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`input-dark${error ? ' error' : ''}${className ? ' ' + className : ''}`}
        style={style}
        {...props}
      />
      {error && (
        <p
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: '11px',
            color: 'var(--danger)',
            margin: '2px 0 0',
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
)

Input.displayName = 'Input'

export default Input
