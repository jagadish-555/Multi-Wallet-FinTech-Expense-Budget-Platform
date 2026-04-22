import { useState } from 'react'
import type { Expense } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Pencil, Trash2 } from 'lucide-react'

interface ExpenseRowProps {
  expense: Expense
  onEdit: (expense: Expense) => void
  onDelete: (expense: Expense) => void
}

export default function ExpenseRow({ expense, onEdit, onDelete }: ExpenseRowProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <tr
      className="table-data-row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Category */}
      <td style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: expense.category?.colorHex ?? '#f5a623',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}
          >
            {expense.category?.name ?? '—'}
          </span>
        </div>
      </td>

      {/* Description */}
      <td style={{ padding: '14px 20px' }}>
        <p
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          {expense.description}
        </p>
      </td>

      {/* Amount */}
      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--text-primary)',
          }}
        >
          {formatCurrency(expense.amount, expense.currency)}
        </span>
      </td>

      {/* Date */}
      <td style={{ padding: '14px 20px' }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}
        >
          {formatDate(expense.expenseDate)}
        </span>
      </td>

      {/* Actions — reveal on hover */}
      <td style={{ padding: '14px 20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.15s ease',
          }}
        >
          <button
            onClick={() => onEdit(expense)}
            style={{
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              background: 'none',
              border: 'none',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-tertiary)' }}
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(expense)}
            style={{
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              background: 'none',
              border: 'none',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--danger)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-tertiary)' }}
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  )
}
