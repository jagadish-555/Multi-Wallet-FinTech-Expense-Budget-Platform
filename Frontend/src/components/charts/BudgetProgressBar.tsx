import type { BudgetWithUsage } from '@/types'
import { useAuthStore } from '@/store/auth.store'
import { formatCurrency } from '@/lib/utils'

interface BudgetProgressBarProps {
  budget: BudgetWithUsage
}

export default function BudgetProgressBar({ budget }: BudgetProgressBarProps) {
  const currency = useAuthStore((s) => s.user?.currency ?? 'INR')
  const pct = Math.min(budget.percentUsed, 100)

  const fillColor =
    budget.isExceeded
      ? 'var(--danger)'
      : budget.percentUsed >= 80
      ? 'var(--warning)'
      : 'var(--success)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <span
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--text-primary)',
          }}
        >
          {budget.category?.name ?? 'Overall'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}
          >
            {formatCurrency(budget.spentAmount, currency)} / {formatCurrency(budget.limitAmount, currency)}
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px',
              fontWeight: 500,
              color: budget.isExceeded ? 'var(--danger)' : 'var(--text-secondary)',
            }}
          >
            {budget.percentUsed.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div
        style={{
          height: '6px',
          backgroundColor: 'var(--bg-overlay)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
      >
        <div
          className="progress-bar-fill"
          style={{
            height: '100%',
            width: `${pct}%`,
            backgroundColor: fillColor,
            borderRadius: 'var(--radius-full)',
          }}
        />
      </div>
    </div>
  )
}
