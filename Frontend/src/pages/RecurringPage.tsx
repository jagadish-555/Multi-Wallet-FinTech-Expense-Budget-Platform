import { useState } from 'react'
import {
  useRecurring,
  usePauseRecurring,
  useResumeRecurring,
  useDeleteRecurring,
} from '@/hooks/useRecurring'
import { useToastStore } from '@/store/toast.store'
import type { RecurringExpense } from '@/types'
import RecurringList from '@/components/recurring/RecurringList'
import RecurringForm from '@/components/recurring/RecurringForm'
import Modal from '@/components/ui/Modal'
import Skeleton from '@/components/ui/Skeleton'
import ErrorState from '@/components/ui/ErrorState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Button from '@/components/ui/Button'
import { Plus } from 'lucide-react'

export default function RecurringPage() {
  const { data: recurring = [], isLoading, isError, refetch } = useRecurring()
  const pauseRecurring = usePauseRecurring()
  const resumeRecurring = useResumeRecurring()
  const deleteRecurring = useDeleteRecurring()
  const addToast = useToastStore((s) => s.addToast)

  const [showForm, setShowForm] = useState(false)
  const [deletingRecurring, setDeletingRecurring] = useState<RecurringExpense | null>(null)

  const handlePause = async (id: string) => {
    try {
      await pauseRecurring.mutateAsync(id)
      addToast('Recurring expense paused', 'success')
    } catch {
      addToast('Unable to pause recurring expense', 'error')
    }
  }

  const handleResume = async (id: string) => {
    try {
      await resumeRecurring.mutateAsync(id)
      addToast('Recurring expense resumed', 'success')
    } catch {
      addToast('Unable to resume recurring expense', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deletingRecurring) return
    try {
      await deleteRecurring.mutateAsync(deletingRecurring.id)
      addToast('Recurring expense deleted', 'success')
      setDeletingRecurring(null)
    } catch {
      addToast('Unable to delete recurring expense', 'error')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header bar */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          {recurring.length} recurring rule{recurring.length !== 1 ? 's' : ''}
        </p>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus size={14} />
          New Recurring
        </Button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <RecurringList
          items={recurring}
          onPause={handlePause}
          onResume={handleResume}
          onDelete={setDeletingRecurring}
        />
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Create Recurring Expense">
        <RecurringForm onClose={() => setShowForm(false)} />
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingRecurring)}
        onClose={() => setDeletingRecurring(null)}
        onConfirm={handleDelete}
        title="Delete recurring expense"
        message={`Delete recurring rule for ${deletingRecurring?.description ?? 'this item'}?`}
        confirmLabel="Delete"
        loading={deleteRecurring.isPending}
      />
    </div>
  )
}
