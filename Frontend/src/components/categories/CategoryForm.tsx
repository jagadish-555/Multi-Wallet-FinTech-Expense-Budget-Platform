import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { categorySchema } from '@/lib/validators'
import { useCategories, useCreateCategory, useUpdateCategory } from '@/hooks/useCategories'
import { useToastStore } from '@/store/toast.store'
import type { Category } from '@/types'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

type FormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
  category?: Category
  onClose: () => void
}

const ICON_CHOICES = ['🍔', '🛒', '🏠', '🚕', '🎬', '💊', '📚', '🎁', '✈️', '💼']
const COLOR_CHOICES = ['#4f46e5', '#14b8a6', '#f97316', '#ef4444', '#0ea5e9', '#eab308', '#8b5cf6', '#64748b']

export default function CategoryForm({ category, onClose }: CategoryFormProps) {
  const { data: categories = [] } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const addToast = useToastStore((s) => s.addToast)
  const isEdit = Boolean(category)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? '',
      icon: category?.icon ?? '🛒',
      colorHex: category?.colorHex ?? '#4f46e5',
      parentId: category?.parentId ?? '',
    },
  })

  const selectedIcon = watch('icon')
  const selectedColor = watch('colorHex')
  const parentChoices = categories.filter((c) => c.id !== category?.id)

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        name: data.name,
        icon: data.icon,
        colorHex: data.colorHex,
        parentId: data.parentId || undefined,
      }
      if (isEdit && category) {
        await updateCategory.mutateAsync({ id: category.id, data: payload })
        addToast('Category updated', 'success')
      } else {
        await createCategory.mutateAsync(payload)
        addToast('Category created', 'success')
      }
      onClose()
    } catch {
      addToast('Unable to save category', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        id="cat-name"
        label="Category Name"
        placeholder="Food, Rent, Travel..."
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Parent Category</label>
        <select
          id="cat-parent"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          {...register('parentId')}
        >
          <option value="">None</option>
          {parentChoices.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Icon</label>
        <div className="grid grid-cols-5 gap-2">
          {ICON_CHOICES.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setValue('icon', icon, { shouldValidate: true })}
              className={`h-10 rounded-lg border text-lg transition-colors ${
                selectedIcon === icon
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
        {errors.icon && <p className="text-red-500 text-xs">{errors.icon.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Color</label>
        <div className="flex items-center gap-2 flex-wrap">
          {COLOR_CHOICES.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('colorHex', color, { shouldValidate: true })}
              className={`w-8 h-8 rounded-full border-2 ${
                selectedColor === color ? 'border-gray-900' : 'border-white'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setValue('colorHex', e.target.value, { shouldValidate: true })}
            className="w-10 h-10 rounded border border-gray-200 p-1"
          />
          <span className="text-xs text-gray-500 uppercase">{selectedColor}</span>
        </div>
        {errors.colorHex && <p className="text-red-500 text-xs">{errors.colorHex.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={isSubmitting || createCategory.isPending || updateCategory.isPending}>
          {isEdit ? 'Save category' : 'Create category'}
        </Button>
      </div>
    </form>
  )
}
