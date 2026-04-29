import type { BudgetWithUsage } from '@/types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import BudgetProgressBar from '@/components/charts/BudgetProgressBar'
import { Pencil, Trash2 } from 'lucide-react'

interface BudgetCardProps {
  budget: BudgetWithUsage
  onEdit: (budget: BudgetWithUsage) => void
  onDelete: (budget: BudgetWithUsage) => void
}

function getPeriodLabel(period: BudgetWithUsage['period']) {
  if (period === 'ROLLING_30') return 'Rolling 30'
  if (period === 'PAYCHECK') return 'Paycheck'
  return 'Monthly'
}

export default function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  return (
    <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] p-5 space-y-4 hover:border-[var(--border-strong)] transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            {budget.category?.name ?? 'Overall Budget'}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {getPeriodLabel(budget.period)} • Day {budget.periodDay}
          </p>
        </div>
        <Badge variant={budget.isExceeded ? 'danger' : budget.percentUsed >= 80 ? 'warning' : 'success'}>
          {budget.isExceeded ? 'Exceeded' : `${budget.percentUsed.toFixed(0)}%`}
        </Badge>
      </div>

      <BudgetProgressBar budget={budget} />

      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => onEdit(budget)}>
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(budget)}>
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </div>
  )
}
