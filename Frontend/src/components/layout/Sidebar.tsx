import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Receipt,
  Target,
  Tag,
  // RefreshCw,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'

const navItems = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/expenses',   icon: Receipt,          label: 'Expenses' },
  { to: '/budgets',    icon: Target,           label: 'Budgets' },
  { to: '/categories', icon: Tag,              label: 'Categories' },
  // { to: '/recurring',  icon: RefreshCw,        label: 'Recurring' },
  { to: '/analytics',  icon: BarChart3,        label: 'Analytics' },
  { to: '/settings',   icon: Settings,         label: 'Settings' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isGuest = user?.email === 'test@example.com'

  const initials = isGuest 
    ? 'G' 
    : user?.name
        ?.split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '?'

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 40,
    height: '100%',
    width: '240px',
    backgroundColor: 'var(--bg-surface)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease',
  }

  return (
    <>
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 30,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(2px)',
          }}
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        style={{
          ...sidebarStyle,
          transform: sidebarOpen ? 'translateX(0)' : undefined,
        }}
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div
          style={{
            padding: '24px 20px 20px',
            borderBottom: '1px solid var(--border)',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '16px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>Expense</span>
            <span style={{ color: 'var(--accent)' }}>Track</span>
          </div>
          <div
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-secondary)',
              marginTop: '4px',
            }}
          >
            Personal Finance
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '4px 8px', overflowY: 'auto' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: isActive ? '10px 13px' : '10px 16px',
                margin: '2px 0',
                borderRadius: 'var(--radius-md)',
                fontFamily: "'Sora', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--accent-subtle)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                transition: 'all 0.15s ease',
                textDecoration: 'none',
                cursor: 'pointer',
              })}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                if (!el.getAttribute('data-active')) {
                  el.style.backgroundColor = 'var(--bg-elevated)'
                  el.style.color = 'var(--text-primary)'
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                if (!el.getAttribute('data-active')) {
                  el.style.backgroundColor = ''
                  el.style.color = ''
                }
              }}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    style={{
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                      flexShrink: 0,
                    }}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-subtle)',
              border: '1px solid var(--border-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Sora', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--accent)',
              flexShrink: 0,
            }}
          >
            {initials}
          </div>

          {/* Name & email */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {isGuest ? 'Guest' : user?.name}
            </p>
            {!isGuest && (
              <p
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.email}
              </p>
            )}
          </div>

          {/* Logout icon */}
          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              background: 'none',
              border: 'none',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              transition: 'color 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--danger)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-tertiary)' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  )
}
