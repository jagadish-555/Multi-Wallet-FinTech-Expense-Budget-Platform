import type { RecurringExpense } from '@/types'
import { formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { RefreshCw, Pause, Play, Trash2 } from 'lucide-react'

interface RecurringListProps {
  items: RecurringExpense[]
  onPause: (id: string) => void
  onResume: (id: string) => void
  onDelete: (item: RecurringExpense) => void
}

export default function RecurringList({ items, onPause, onResume, onDelete }: RecurringListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={RefreshCw}
        title="No recurring expenses"
        description="Set automatic recurring transactions for subscriptions and bills."
      />
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{item.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {item.category.icon} {item.category.name} • {item.scheduleType}
              </p>
            </div>
            <Badge variant={item.isActive ? 'success' : 'neutral'}>
              {item.isActive ? 'Active' : 'Paused'}
            </Badge>
          </div>

          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
            <div>
              <p className="uppercase tracking-wide">Amount</p>
              <p className="text-sm font-semibold text-gray-900">{item.currency} {Number(item.amount).toFixed(2)}</p>
            </div>
            <div>
              <p className="uppercase tracking-wide">Next Due</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(item.nextDueDate)}</p>
            </div>
            <div>
              <p className="uppercase tracking-wide">Start</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(item.startDate)}</p>
            </div>
            <div>
              <p className="uppercase tracking-wide">End</p>
              <p className="text-sm font-semibold text-gray-900">{item.endDate ? formatDate(item.endDate) : 'Open'}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            {item.isActive ? (
              <Button variant="secondary" size="sm" onClick={() => onPause(item.id)}>
                <Pause className="w-4 h-4" />
                Pause
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => onResume(item.id)}>
                <Play className="w-4 h-4" />
                Resume
              </Button>
            )}
            <Button variant="danger" size="sm" onClick={() => onDelete(item)}>
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
