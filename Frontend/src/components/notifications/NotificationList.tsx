import { TriangleAlert, RefreshCw, Bell, Info } from 'lucide-react'
import type { Notification } from '@/types'
import { formatRelativeTime } from '@/lib/utils'
import { useMarkNotificationRead } from '@/hooks/useNotifications'

const TYPE_CONFIG: Record<
  Notification['type'],
  { icon: React.ReactNode; bgColor: string }
> = {
  BUDGET_ALERT: {
    icon: <TriangleAlert size={14} style={{ color: 'var(--warning)' }} />,
    bgColor: 'var(--warning-dim)',
  },
  RECURRING_DUE: {
    icon: <RefreshCw size={14} style={{ color: 'var(--accent)' }} />,
    bgColor: 'var(--accent-subtle)',
  },
  SPLIT_REQUEST: {
    icon: <Bell size={14} style={{ color: 'var(--success)' }} />,
    bgColor: 'var(--success-dim)',
  },
  SYSTEM: {
    icon: <Info size={14} style={{ color: 'var(--info)' }} />,
    bgColor: 'var(--info-dim)',
  },
}

interface NotificationListProps {
  notifications: Notification[]
}

export default function NotificationList({ notifications }: NotificationListProps) {
  const markRead = useMarkNotificationRead()

  if (notifications.length === 0) {
    return (
      <div
        style={{
          padding: '40px 16px',
          textAlign: 'center',
          fontFamily: "'Sora', sans-serif",
          fontSize: '13px',
          color: 'var(--text-tertiary)',
        }}
      >
        No notifications yet
      </div>
    )
  }

  return (
    <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
      {notifications.map((n) => {
        const config = TYPE_CONFIG[n.type]
        return (
          <button
            key={n.id}
            onClick={() => !n.isRead && markRead.mutate(n.id)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: n.isRead ? '12px 16px' : '12px 13px 12px 13px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              cursor: n.isRead ? 'default' : 'pointer',
              backgroundColor: 'transparent',
              border: 'none',
              borderLeft: n.isRead ? 'none' : '3px solid var(--info)',
              transition: 'background 0.1s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--bg-elevated)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}
          >
            {/* Icon circle */}
            <div
              style={{
                position: 'relative',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: config.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {config.icon}
              {!n.isRead && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                    border: '2px solid var(--bg-surface)',
                  }}
                />
              )}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '13px',
                  fontWeight: n.isRead ? 400 : 500,
                  color: 'var(--text-primary)',
                  margin: '0 0 2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {n.title}
              </p>
              <p
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  margin: '0 0 4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {n.message}
              </p>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  color: 'var(--text-tertiary)',
                  margin: 0,
                }}
              >
                {formatRelativeTime(n.createdAt)}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
