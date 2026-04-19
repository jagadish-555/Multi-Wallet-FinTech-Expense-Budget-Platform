import type { Expense } from '@/types'
import ExpenseRow from './ExpenseRow'
import Skeleton from '@/components/ui/Skeleton'
import ErrorState from '@/components/ui/ErrorState'
import { Receipt } from 'lucide-react'


interface ExpenseTableProps {
  expenses: Expense[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onEdit: (expense: Expense) => void
  onDelete: (expense: Expense) => void
}

export default function ExpenseTable({
  expenses,
  isLoading,
  isError,
  onRetry,
  onEdit,
  onDelete,
}: ExpenseTableProps) {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '8px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} style={{ height: '52px' }} />
        ))}
      </div>
    )
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} />
  }

  if (expenses.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 24px',
          gap: '12px',
          textAlign: 'center',
        }}
      >
        <Receipt size={48} style={{ color: 'var(--text-tertiary)' }} />
        <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          No expenses yet
        </p>
        <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
          Start tracking by adding your first expense.
        </p>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr
            style={{
              backgroundColor: 'var(--bg-overlay)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {['Category', 'Description', 'Amount', 'Date', ''].map((h) => (
              <th
                key={h}
                className="table-header-cell"
                style={{ textAlign: h === 'Amount' ? 'right' : 'left' }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <ExpenseRow key={e.id} expense={e} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
