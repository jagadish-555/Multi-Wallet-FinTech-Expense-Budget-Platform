import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import type { z } from 'zod'
import { budgetSchema } from '@/lib/validators'
import { useBudgets, useCreateBudget, useUpdateBudget } from '@/hooks/useBudgets'
import { useCategories } from '@/hooks/useCategories'
import { useAuthStore } from '@/store/auth.store'
import { useToastStore } from '@/store/toast.store'
import type { BudgetWithUsage } from '@/types'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

type FormInput = z.input<typeof budgetSchema>
type FormData = z.output<typeof budgetSchema>

interface BudgetFormProps {
  budget?: BudgetWithUsage
  onClose: () => void
}

export default function BudgetForm({ budget, onClose }: BudgetFormProps) {
  const user = useAuthStore((s) => s.user)
  const { data: categories = [] } = useCategories()
  const budgets = useBudgets()
  const createBudget = useCreateBudget()
  const updateBudget = useUpdateBudget()
  const addToast = useToastStore((s) => s.addToast)
  const isEdit = Boolean(budget)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      categoryId: budget?.categoryId ?? '',
      limitAmount: budget?.limitAmount,
      currency: (budget?.currency as FormInput['currency']) ?? (user?.currency as FormInput['currency']) ?? 'INR',
      period: budget?.period ?? 'MONTHLY',
      periodDay: budget?.periodDay ?? 1,
      startDate: format(new Date(), 'yyyy-MM-dd'),
    },
  })

  const usedCategoryIds = budgets.data?.map((b) => b.categoryId).filter(Boolean) ?? []
  const categoryOptions = categories

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && budget) {
        await updateBudget.mutateAsync({
          id: budget.id,
          data: {
            categoryId: data.categoryId || undefined,
            limitAmount: data.limitAmount,
            currency: data.currency,
            period: data.period,
            periodDay: data.periodDay,
            isActive: true,
          },
        })
        addToast('Budget updated', 'success')
      } else {
        await createBudget.mutateAsync({
          categoryId: data.categoryId || undefined,
          limitAmount: data.limitAmount,
          currency: data.currency,
          period: data.period,
          periodDay: data.periodDay,
          startDate: data.startDate,
        })
        addToast('Budget created', 'success')
      }
      onClose()
    } catch {
      addToast('Unable to save budget', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</label>
        <select
          id="budget-category"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          {...register('categoryId')}
        >
          <option value="">Overall (all categories)</option>
          {categoryOptions.map((category) => (
            <option
              key={category.id}
              value={category.id}
              disabled={!isEdit && usedCategoryIds.includes(category.id)}
            >
              {category.icon} {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="budget-limit"
          label="Limit Amount"
          type="number"
          step="0.01"
          error={errors.limitAmount?.message}
          {...register('limitAmount')}
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Currency</label>
          <select
            id="budget-currency"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            {...register('currency')}
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Period</label>
          <select
            id="budget-period"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            {...register('period')}
          >
            <option value="MONTHLY">Monthly</option>
            <option value="ROLLING_30">Rolling 30 Days</option>
            <option value="PAYCHECK">Paycheck</option>
          </select>
        </div>
        <Input
          id="budget-period-day"
          label="Period Day"
          type="number"
          min="1"
          max="31"
          error={errors.periodDay?.message}
          {...register('periodDay')}
        />
      </div>

      {!isEdit && (
        <Input
          id="budget-start-date"
          label="Start Date"
          type="date"
          error={errors.startDate?.message}
          {...register('startDate')}
        />
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={isSubmitting || createBudget.isPending || updateBudget.isPending}>
          {isEdit ? 'Save budget' : 'Create budget'}
        </Button>
      </div>
    </form>
  )
}
