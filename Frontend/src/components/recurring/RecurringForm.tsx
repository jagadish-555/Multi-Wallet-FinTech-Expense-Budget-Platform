import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import type { z } from 'zod'
import { recurringSchema } from '@/lib/validators'
import { useCategories } from '@/hooks/useCategories'
import { useCreateRecurring } from '@/hooks/useRecurring'
import { useAuthStore } from '@/store/auth.store'
import { useToastStore } from '@/store/toast.store'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

type FormInput = z.input<typeof recurringSchema>
type FormData = z.output<typeof recurringSchema>

interface RecurringFormProps {
  onClose: () => void
}

export default function RecurringForm({ onClose }: RecurringFormProps) {
  const { data: categories = [] } = useCategories()
  const createRecurring = useCreateRecurring()
  const user = useAuthStore((s) => s.user)
  const addToast = useToastStore((s) => s.addToast)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(recurringSchema),
    defaultValues: {
      categoryId: '',
      amount: undefined,
      currency: (user?.currency as FormInput['currency']) ?? 'INR',
      description: '',
      scheduleType: 'MONTHLY',
      scheduleDay: 1,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: '',
    },
  })

  const scheduleType = watch('scheduleType')

  const onSubmit = async (data: FormData) => {
    try {
      await createRecurring.mutateAsync({
        categoryId: data.categoryId,
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        scheduleType: data.scheduleType,
        scheduleDay: data.scheduleType === 'DAILY' ? undefined : data.scheduleDay,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
      })
      addToast('Recurring expense created', 'success')
      onClose()
    } catch {
      addToast('Unable to create recurring expense', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</label>
        <select
          id="recurring-category"
          className="select-dark capitalize"
          {...register('categoryId')}
        >
          <option value="">Select category...</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="text-red-500 text-xs">{errors.categoryId.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="recurring-amount"
          label="Amount"
          type="number"
          step="0.01"
          error={errors.amount?.message}
          {...register('amount')}
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Currency</label>
          <select
            id="recurring-currency"
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
        id="recurring-description"
        label="Description"
        placeholder="Monthly software subscription"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Schedule</label>
          <select
            id="recurring-schedule"
            className="select-dark"
            {...register('scheduleType')}
          >
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>

        {scheduleType !== 'DAILY' ? (
          <Input
            id="recurring-day"
            label={scheduleType === 'WEEKLY' ? 'Weekday (1-7)' : 'Day (1-31)'}
            type="number"
            min="1"
            max={scheduleType === 'WEEKLY' ? '7' : '31'}
            error={errors.scheduleDay?.message}
            {...register('scheduleDay')}
          />
        ) : (
          <div />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="recurring-start"
          label="Start Date"
          type="date"
          error={errors.startDate?.message}
          {...register('startDate')}
        />
        <Input
          id="recurring-end"
          label="End Date"
          type="date"
          error={errors.endDate?.message}
          {...register('endDate')}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={isSubmitting || createRecurring.isPending}>Create recurring</Button>
      </div>
    </form>
  )
}
