import { useEffect /*, useState */ } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { updateProfileSchema, changePasswordSchema } from '@/lib/validators'
import { useAuthStore } from '@/store/auth.store'
import { useToastStore } from '@/store/toast.store'
import { useUpdateProfile, /* useUpdatePreferences, */ useChangePassword } from '@/hooks/useAuth'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
// import { User, Shield, Sliders } from 'lucide-react'
import { User, Shield } from 'lucide-react'

type ProfileFormData = z.infer<typeof updateProfileSchema>
type PasswordFormData = z.infer<typeof changePasswordSchema>

const SECTION_CARD: React.CSSProperties = {
  backgroundColor: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  boxShadow: 'var(--shadow-card)',
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '14px',
        marginBottom: '20px',
      }}
    >
      <Icon size={18} style={{ color: 'var(--text-secondary)' }} />
      <h2
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        {title}
      </h2>
    </div>
  )
}

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user)
  const addToast = useToastStore((s) => s.addToast)
  const updateProfile = useUpdateProfile()
  // const updatePreferences = useUpdatePreferences()
  const changePassword = useChangePassword()

  const isGuest = user?.email === 'Guest@example.com'

  /*
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [startOfWeek, setStartOfWeek] = useState('MONDAY')
  */

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name ?? '',
      currency: (user?.currency as ProfileFormData['currency']) ?? 'INR',
      timezone: user?.timezone ?? 'Asia/Kolkata',
    },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  useEffect(() => {
    profileForm.reset({
      name: user?.name ?? '',
      currency: (user?.currency as ProfileFormData['currency']) ?? 'INR',
      timezone: user?.timezone ?? 'Asia/Kolkata',
    })
  }, [user, profileForm])

  const onProfileSubmit = async (data: ProfileFormData) => {
    if (isGuest) {
      addToast('Guest account cannot modify profile', 'error')
      return
    }
    try {
      await updateProfile.mutateAsync(data)
      addToast('Profile updated', 'success')
    } catch {
      addToast('Unable to update profile', 'error')
    }
  }

  /*
  const onPreferencesSubmit = async () => {
    try {
      await updatePreferences.mutateAsync({ emailNotifications, startOfWeek })
      addToast('Preferences updated', 'success')
    } catch {
      addToast('Unable to update preferences', 'error')
    }
  }
  */

  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (isGuest) {
      addToast('Guest account cannot modify profile', 'error')
      return
    }
    try {
      await changePassword.mutateAsync({ currentPassword: data.currentPassword, newPassword: data.newPassword })
      passwordForm.reset()
      addToast('Password changed', 'success')
    } catch {
      addToast('Unable to change password', 'error')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Profile */}
      <div style={SECTION_CARD}>
        <SectionHeader icon={User} title="Profile" />
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
          <Input
            id="settings-name"
            label="Full Name"
            error={profileForm.formState.errors.name?.message}
            {...profileForm.register('name')}
          />

          {/* Email (disabled) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="label-dark" htmlFor="settings-email">Email</label>
            <input
              id="settings-email"
              type="email"
              value={user?.email ?? ''}
              disabled
              className="input-dark"
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="label-dark" htmlFor="settings-currency">Currency</label>
              <select id="settings-currency" className="select-dark" {...profileForm.register('currency')}>
                <option value="INR">INR — Indian Rupee</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
              </select>
            </div>
            <Input
              id="settings-timezone"
              label="Timezone"
              error={profileForm.formState.errors.timezone?.message}
              {...profileForm.register('timezone')}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" loading={updateProfile.isPending}>Save Profile</Button>
          </div>
        </form>
      </div>

      {/* Preferences */}
      {/*
      <div style={SECTION_CARD}>
        <SectionHeader icon={Sliders} title="Preferences" />
        <div>
          <ToggleRow
            label="Email notifications"
            sub="Receive budget and recurring alerts by email."
            checked={emailNotifications}
            onChange={() => setEmailNotifications((v) => !v)}
          />
          <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
            <label className="label-dark" htmlFor="settings-week-start">Start of Week</label>
            <div style={{ marginTop: '6px', maxWidth: '240px' }}>
              <select
                id="settings-week-start"
                value={startOfWeek}
                onChange={(e) => setStartOfWeek(e.target.value)}
                className="select-dark"
              >
                <option value="MONDAY">Monday</option>
                <option value="SUNDAY">Sunday</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onPreferencesSubmit} loading={updatePreferences.isPending}>
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
      */}

      {/* Security */}
      <div style={SECTION_CARD}>
        <SectionHeader icon={Shield} title="Security" />
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} noValidate>
          <Input
            id="settings-current-password"
            type="password"
            label="Current Password"
            error={passwordForm.formState.errors.currentPassword?.message}
            {...passwordForm.register('currentPassword')}
          />
          <Input
            id="settings-new-password"
            type="password"
            label="New Password"
            error={passwordForm.formState.errors.newPassword?.message}
            {...passwordForm.register('newPassword')}
          />
          <Input
            id="settings-confirm-password"
            type="password"
            label="Confirm New Password"
            error={passwordForm.formState.errors.confirmPassword?.message}
            {...passwordForm.register('confirmPassword')}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" loading={changePassword.isPending}>Update Password</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
