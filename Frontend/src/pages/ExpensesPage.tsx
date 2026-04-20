import { useState, useCallback } from 'react'
import { useExpenses } from '@/hooks/useExpenses'
import { useCategories } from '@/hooks/useCategories'
// import { expenseApi } from '@/api/expense.api'
// import { useAuthStore } from '@/store/auth.store'
import type { Expense, ExpenseFilters } from '@/types'
import ExpenseTable from '@/components/expenses/ExpenseTable'
import ExpenseFiltersBar from '@/components/expenses/ExpenseFilters'
import ExpenseForm from '@/components/expenses/ExpenseForm'
import ExpenseDeleteDialog from '@/components/expenses/ExpenseDeleteDialog'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
// import { Plus, Download } from 'lucide-react'
import { Plus } from 'lucide-react'

export default function ExpensesPage() {
  // const user = useAuthStore((s) => s.user)
  const { data: categories = [] } = useCategories()

  const [filters, setFilters] = useState<ExpenseFilters>({ page: 1, limit: 15 })
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null)
  const [showForm, setShowForm] = useState(false)

  const { data, isLoading, isError, refetch } = useExpenses(filters)

  const handleFiltersChange = useCallback(
    (f: { from: string; to: string; categoryId: string; description: string; tags: string }) => {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        from: f.from || undefined,
        to: f.to || undefined,
        categoryId: f.categoryId || undefined,
        description: f.description || undefined,
        tags: f.tags || undefined,
      }))
    },
    []
  )

  /*
  const handleExport = async () => {
    const blob = await expenseApi.exportCsv({
      from: filters.from,
      to: filters.to,
      categoryId: filters.categoryId,
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `expenses-${user?.email ?? 'export'}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }
  */

  const meta = data?.meta
  const expenses = data?.expenses ?? []
  const from = meta ? (meta.page - 1) * meta.limit + 1 : 0
  const to = meta ? Math.min(meta.page * meta.limit, meta.total) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Filter bar */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <ExpenseFiltersBar categories={categories} onFiltersChange={handleFiltersChange} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* <Button variant="secondary" size="sm" onClick={handleExport}>
            <Download size={14} />
            Export CSV
          </Button> */}
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus size={14} />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        <ExpenseTable
          expenses={expenses}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          onEdit={(e) => { setEditingExpense(e); setShowForm(true) }}
          onDelete={setDeletingExpense}
        />

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 20px',
              borderTop: '1px solid var(--border)',
            }}
          >
            <span
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: '13px',
                color: 'var(--text-secondary)',
              }}
            >
              Showing {from}–{to} of {meta.total} results
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Button
                variant="secondary"
                size="sm"
                disabled={!meta.hasPrevPage}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                const page = i + 1
                const isActive = page === meta.page
                return (
                  <button
                    key={page}
                    onClick={() => setFilters((f) => ({ ...f, page }))}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      border: isActive ? 'none' : '1px solid var(--border-strong)',
                      backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                      color: isActive ? '#0e0f11' : 'var(--text-secondary)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {page}
                  </button>
                )
              })}
              <Button
                variant="secondary"
                size="sm"
                disabled={!meta.hasNextPage}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditingExpense(null) }}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <ExpenseForm
          expense={editingExpense ?? undefined}
          onClose={() => { setShowForm(false); setEditingExpense(null) }}
        />
      </Modal>

      <ExpenseDeleteDialog
        expense={deletingExpense}
        onClose={() => setDeletingExpense(null)}
      />
    </div>
  )
}
