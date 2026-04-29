
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { expenseSchema } from '@/lib/validators'
import { useCreateExpense, useUpdateExpense } from '@/hooks/useExpenses'
import { useCategories } from '@/hooks/useCategories'
import { useAuthStore } from '@/store/auth.store'
import { useToastStore } from '@/store/toast.store'
import type { Expense } from '@/types'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { format } from 'date-fns'

type FormInput = z.input<typeof expenseSchema>
type FormData = z.output<typeof expenseSchema>

interface ExpenseFormProps {
  expense?: Expense
  onClose: () => void
}

export default function ExpenseForm({ expense, onClose }: ExpenseFormProps) {
  const user = useAuthStore((s) => s.user)
  const { data: categories = [] } = useCategories()
  const createExpense = useCreateExpense()
  const updateExpense = useUpdateExpense()
  const addToast = useToastStore((s) => s.addToast)

  const isEdit = !!expense

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: expense?.amount,
      currency: (expense?.currency as FormInput['currency']) ?? (user?.currency as FormInput['currency']) ?? 'INR',
      description: expense?.description ?? '',
      categoryId: expense?.categoryId ?? '',
      expenseDate: expense?.expenseDate
        ? format(new Date(expense.expenseDate), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
    },
  })

  const onSubmit = async (data: FormData) => {
    const payload = {
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      categoryId: data.categoryId,
      expenseDate: data.expenseDate,
    }
    if (isEdit && expense) {
      await updateExpense.mutateAsync({ id: expense.id, data: payload })
      addToast('Expense updated', 'success')
    } else {
      await createExpense.mutateAsync(payload)
      addToast('Expense added', 'success')
    }
    onClose()
  }

  const systemCats = categories.filter((c) => c.isSystem)
  const customCats = categories.filter((c) => !c.isSystem)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="exp-amount"
          label="Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.amount?.message}
          {...register('amount')}
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Currency</label>
          <select
            id="exp-currency"
            className="select-dark"
            {...register('currency')}
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>

      <Input
        id="exp-description"
        label="Description"
        placeholder="Coffee, groceries…"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</label>
        <select
          id="exp-category"
          className="select-dark capitalize"
          {...register('categoryId')}
        >
          <option value="">Select category…</option>
          {systemCats.length > 0 && (
            <optgroup label="System">
              {systemCats.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </optgroup>
          )}
          {customCats.length > 0 && (
            <optgroup label="Custom">
              {customCats.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </optgroup>
          )}
        </select>
        {errors.categoryId && (
          <p className="text-red-500 text-xs">{errors.categoryId.message}</p>
        )}
      </div>

      <Input
        id="exp-date"
        label="Date"
        type="date"
        error={errors.expenseDate?.message}
        {...register('expenseDate')}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? 'Save changes' : 'Add expense'}
        </Button>
      </div>
    </form>
  )
}
