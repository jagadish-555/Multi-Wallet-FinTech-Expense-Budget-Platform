import ConfirmDialog from '@/components/ui/ConfirmDialog'
import type { Expense } from '@/types'
import { useDeleteExpense } from '@/hooks/useExpenses'
import { useToastStore } from '@/store/toast.store'

interface ExpenseDeleteDialogProps {
  expense: Expense | null
  onClose: () => void
}

export default function ExpenseDeleteDialog({ expense, onClose }: ExpenseDeleteDialogProps) {
  const deleteExpense = useDeleteExpense()
  const addToast = useToastStore((s) => s.addToast)

  const handleConfirm = async () => {
    if (!expense) return
    await deleteExpense.mutateAsync(expense.id)
    addToast('Expense deleted', 'success')
    onClose()
  }

  return (
    <ConfirmDialog
      open={!!expense}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Delete expense"
      message={`Are you sure you want to delete "${expense?.description}"? This cannot be undone.`}
      confirmLabel="Delete"
      loading={deleteExpense.isPending}
    />
  )
}
