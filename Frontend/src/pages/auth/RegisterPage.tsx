import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import type { z } from 'zod'
import { registerSchema } from '@/lib/validators'
import { useRegister } from '@/hooks/useAuth'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

type FormData = z.infer<typeof registerSchema>

function getPasswordStrength(pwd: string): { label: string; color: string; width: string } {
  if (pwd.length === 0) return { label: '', color: '', width: '0%' }
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  if (score <= 1) return { label: 'Weak', color: 'var(--danger)', width: '33%' }
  if (score <= 2) return { label: 'Medium', color: 'var(--warning)', width: '66%' }
  return { label: 'Strong', color: 'var(--success)', width: '100%' }
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { mutateAsync: register } = useRegister()
  const [serverError, setServerError] = useState('')
  const [pwdValue, setPwdValue] = useState('')

  const {
    register: rhf,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(registerSchema) })

  const watchedPwd = watch('password', '')
  const strength = getPasswordStrength(watchedPwd ?? pwdValue)

  const onSubmit = async (data: FormData) => {
    setServerError('')
    try {
      await register(data)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Registration failed'
      setServerError(msg)
    }
  }

  return (
    <div
      className="auth-grid-bg"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '40px',
            boxShadow: 'var(--shadow-elevated)',
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: '8px',
              }}
            >
              <span style={{ color: 'var(--text-primary)' }}>Expense</span>
              <span style={{ color: 'var(--accent)' }}>Track</span>
            </div>
            <p
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: '13px',
                color: 'var(--text-secondary)',
                margin: 0,
              }}
            >
              Track your money, understand your patterns.
            </p>
          </div>

          {/* Form header */}
          <h2
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: '0 0 24px',
            }}
          >
            Create your account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
            <Input
              id="reg-name"
              label="Full Name"
              placeholder="John Doe"
              error={errors.name?.message}
              {...rhf('name')}
            />
            <Input
              id="reg-email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...rhf('email')}
            />

            {/* Password + strength meter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Input
                id="reg-password"
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...rhf('password', {
                  onChange: (e) => setPwdValue(e.target.value),
                })}
              />
              {(watchedPwd || pwdValue) && strength.label && (
                <div>
                  <div className="strength-bar">
                    <div
                      className="strength-bar-fill"
                      style={{
                        width: strength.width,
                        backgroundColor: strength.color,
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: '11px',
                      color: strength.color,
                      margin: '4px 0 0',
                    }}
                  >
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Currency */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="label-dark" htmlFor="reg-currency">
                Currency
              </label>
              <select
                id="reg-currency"
                className="select-dark"
                {...rhf('currency')}
              >
                <option value="INR">INR — Indian Rupee</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
              </select>
              {errors.currency && (
                <p style={{ fontFamily: "'Sora'", fontSize: '11px', color: 'var(--danger)', margin: 0 }}>
                  {errors.currency.message}
                </p>
              )}
            </div>

            {serverError && (
              <p
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '13px',
                  color: 'var(--danger)',
                  textAlign: 'center',
                  margin: 0,
                  padding: '10px',
                  backgroundColor: 'var(--danger-dim)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}
              >
                {serverError}
              </p>
            )}

            <Button type="submit" loading={isSubmitting} size="lg" style={{ width: '100%', marginTop: '8px' }}>
              Create account
            </Button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
            <span style={{ fontFamily: "'Sora'", fontSize: '12px', color: 'var(--text-tertiary)' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
          </div>

          <p style={{ textAlign: 'center', fontFamily: "'Sora'", fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
