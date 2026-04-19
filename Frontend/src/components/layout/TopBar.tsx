import { Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useUIStore } from '@/store/ui.store'
import NotificationBell from '@/components/notifications/NotificationBell'

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/expenses': 'Expenses',
  '/budgets': 'Budgets',
  '/categories': 'Categories',
  '/recurring': 'Recurring',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
}

export default function TopBar() {
  const { toggleSidebar } = useUIStore()
  const { pathname } = useLocation()
  const title = routeTitles[pathname] ?? 'ExpenseTrack'

  return (
    <header
      style={{
        height: '60px',
        backgroundColor: 'rgba(14, 15, 17, 0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <button
        onClick={toggleSidebar}
        className="lg:hidden"
        style={{
          background: 'none',
          border: 'none',
          padding: '6px',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)' }}
      >
        <Menu size={20} />
      </button>

      <h1
        style={{
          flex: 1,
          fontFamily: "'Sora', sans-serif",
          fontSize: '20px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h1>

      <NotificationBell />
    </header>
  )
}
