import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import type { z } from 'zod'
import { loginSchema } from '@/lib/validators'
import { useLogin } from '@/hooks/useAuth'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

type FormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'
  const { mutateAsync: login, isPending: isGuestLoading } = useLogin()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: FormData) => {
    setServerError('')
    try {
      await login({ email: data.email, password: data.password })
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Login failed'
      setServerError(msg)
    }
  }

  const handleGuestLogin = async () => {
    setServerError('')
    try {
      await login({ email: 'Guest@example.com', password: 'Password123' })
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Guest login failed'
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
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
            <Input
              id="login-email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              id="login-password"
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                id="login-remember"
                type="checkbox"
                className="checkbox-dark"
                {...register('rememberMe')}
              />
              <label
                htmlFor="login-remember"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Remember me
              </label>
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
              Sign in
            </Button>
          </form>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            loading={isGuestLoading}
            style={{ width: '100%', marginTop: '16px' }}
            onClick={handleGuestLogin}
          >
            Continue as Guest
          </Button>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '24px 0',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
            <span
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: '12px',
                color: 'var(--text-tertiary)',
              }}
            >
              or
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
          </div>

          <p
            style={{
              textAlign: 'center',
              fontFamily: "'Sora', sans-serif",
              fontSize: '13px',
              color: 'var(--text-secondary)',
              margin: 0,
            }}
          >
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--accent)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
