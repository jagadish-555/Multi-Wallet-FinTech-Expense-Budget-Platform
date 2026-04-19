import { useState } from 'react'
import { useBudgets, useDeleteBudget } from '@/hooks/useBudgets'
import { useAuthStore } from '@/store/auth.store'
import { useToastStore } from '@/store/toast.store'
import { formatCurrency } from '@/lib/utils'
import type { BudgetWithUsage } from '@/types'
import BudgetCard from '@/components/budgets/BudgetCard'
import BudgetForm from '@/components/budgets/BudgetForm'
import Modal from '@/components/ui/Modal'
import Skeleton from '@/components/ui/Skeleton'
import ErrorState from '@/components/ui/ErrorState'
import EmptyState from '@/components/ui/EmptyState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Button from '@/components/ui/Button'
import { Target, Plus } from 'lucide-react'

const METRIC_LABEL: React.CSSProperties = {
  fontFamily: "'Sora', sans-serif",
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--text-secondary)',
  margin: '0 0 10px',
}

const METRIC_VALUE: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '28px',
  fontWeight: 500,
  color: 'var(--text-primary)',
  margin: 0,
}

const CARD: React.CSSProperties = {
  backgroundColor: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  boxShadow: 'var(--shadow-card)',
}

export default function BudgetsPage() {
  const { data: budgets = [], isLoading, isError, refetch } = useBudgets()
  const deleteBudget = useDeleteBudget()
  const addToast = useToastStore((s) => s.addToast)
  const currency = useAuthStore((s) => s.user?.currency ?? 'INR')

  const [showForm, setShowForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState<BudgetWithUsage | null>(null)
  const [deletingBudget, setDeletingBudget] = useState<BudgetWithUsage | null>(null)

  const totalBudgeted = budgets.reduce((s, b) => s + b.limitAmount, 0)
  const totalSpent = budgets.reduce((s, b) => s + b.spentAmount, 0)
  const exceeded = budgets.filter((b) => b.isExceeded).length

  const handleDelete = async () => {
    if (!deletingBudget) return
    try {
      await deleteBudget.mutateAsync(deletingBudget.id)
      addToast('Budget deleted', 'success')
      setDeletingBudget(null)
    } catch {
      addToast('Unable to delete budget', 'error')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          {budgets.length} active budget{budgets.length !== 1 ? 's' : ''}
        </p>
        <Button size="sm" onClick={() => { setEditingBudget(null); setShowForm(true) }}>
          <Plus size={14} />
          New Budget
        </Button>
      </div>

      {/* Summary stat row */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div style={CARD}>
            <p style={METRIC_LABEL}>Total Budgeted</p>
            <p style={METRIC_VALUE}>{formatCurrency(totalBudgeted, currency)}</p>
          </div>
          <div style={CARD}>
            <p style={METRIC_LABEL}>Total Spent</p>
            <p style={METRIC_VALUE}>{formatCurrency(totalSpent, currency)}</p>
          </div>
          <div style={CARD}>
            <p style={METRIC_LABEL}>Budgets Exceeded</p>
            <p style={{ ...METRIC_VALUE, color: exceeded > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
              {exceeded}
            </p>
          </div>
        </div>
      )}

      {/* Budget cards grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : budgets.length === 0 ? (
        <div style={CARD}>
          <EmptyState
            icon={Target}
            title="No budgets set"
            description="Set spending limits for categories or create one overall budget."
            actionLabel="Create Budget"
            onAction={() => { setEditingBudget(null); setShowForm(true) }}
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={(b) => {
                setEditingBudget(b)
                setShowForm(true)
              }}
              onDelete={setDeletingBudget}
            />
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditingBudget(null) }}
        title={editingBudget ? 'Edit Budget' : 'Create Budget'}
      >
        <BudgetForm
          budget={editingBudget ?? undefined}
          onClose={() => { setShowForm(false); setEditingBudget(null) }}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingBudget)}
        onClose={() => setDeletingBudget(null)}
        onConfirm={handleDelete}
        title="Delete budget"
        message={`Delete ${deletingBudget?.category?.name ?? 'overall'} budget?`}
        confirmLabel="Delete"
        loading={deleteBudget.isPending}
      />
    </div>
  )
}
