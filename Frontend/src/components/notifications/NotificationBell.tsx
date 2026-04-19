import { useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications, useMarkAllNotificationsRead } from '@/hooks/useNotifications'
import NotificationList from './NotificationList'
import { useClickOutside } from '@/hooks/useClickOutside'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { data } = useNotifications()
  const notifications = Array.isArray(data) ? data : []
  const markAll = useMarkAllNotificationsRead()

  const unread = notifications.filter((n) => !n.isRead).length

  useClickOutside(containerRef, () => setOpen(false))

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: 'relative',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          const b = e.currentTarget as HTMLButtonElement
          b.style.borderColor = 'var(--border-accent)'
          b.style.color = 'var(--text-primary)'
        }}
        onMouseLeave={(e) => {
          const b = e.currentTarget as HTMLButtonElement
          b.style.borderColor = 'var(--border)'
          b.style.color = 'var(--text-secondary)'
        }}
      >
        <Bell size={17} />
        {unread > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: 'var(--danger)',
              color: 'white',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              fontWeight: 700,
              minWidth: '18px',
              height: '18px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--bg-base)',
              padding: '0 3px',
            }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="notification-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '360px',
            maxHeight: '480px',
            overflowY: 'auto',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-elevated)',
            zIndex: 50,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <span
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              Notifications
            </span>
            {unread > 0 && (
              <button
                onClick={() => markAll.mutate()}
                style={{
                  background: 'none',
                  border: 'none',
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-dim)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)' }}
              >
                Mark all read
              </button>
            )}
          </div>

          <NotificationList notifications={notifications.slice(0, 10)} />
        </div>
      )}
    </div>
  )
}
