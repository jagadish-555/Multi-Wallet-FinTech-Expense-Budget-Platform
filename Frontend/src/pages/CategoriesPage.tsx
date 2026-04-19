import { useMemo, useState } from 'react'
import { useCategories, useDeleteCategory } from '@/hooks/useCategories'
import { useToastStore } from '@/store/toast.store'
import type { Category } from '@/types'
import CategoryList from '@/components/categories/CategoryList'
import CategoryForm from '@/components/categories/CategoryForm'
import Modal from '@/components/ui/Modal'
import Skeleton from '@/components/ui/Skeleton'
import ErrorState from '@/components/ui/ErrorState'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Button from '@/components/ui/Button'
import { Plus, Lock } from 'lucide-react'

export default function CategoriesPage() {
  const { data: categories = [], isLoading, isError, refetch } = useCategories()
  const deleteCategory = useDeleteCategory()
  const addToast = useToastStore((s) => s.addToast)

  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

  const { systemCount, customCount } = useMemo(() => {
    const system = categories.filter((c) => c.isSystem).length
    return { systemCount: system, customCount: categories.length - system }
  }, [categories])

  const handleDelete = async () => {
    if (!deletingCategory) return
    try {
      await deleteCategory.mutateAsync(deletingCategory.id)
      addToast('Category deleted', 'success')
      setDeletingCategory(null)
    } catch {
      addToast('Unable to delete category', 'error')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '13px', color: 'var(--text-secondary)' }}>
            {categories.length} total
          </span>
          <span style={{ color: 'var(--border-strong)', fontSize: '12px' }}>•</span>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '13px', color: 'var(--text-secondary)' }}>
            <Lock size={10} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            {systemCount} system
          </span>
          <span style={{ color: 'var(--border-strong)', fontSize: '12px' }}>•</span>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '13px', color: 'var(--text-secondary)' }}>
            {customCount} custom
          </span>
        </div>
        <Button size="sm" onClick={() => { setEditingCategory(null); setShowForm(true) }}>
          <Plus size={14} />
          New Category
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <CategoryList
          categories={categories}
          onEdit={(category) => {
            setEditingCategory(category)
            setShowForm(true)
          }}
          onDelete={setDeletingCategory}
        />
      )}

      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditingCategory(null) }}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
      >
        <CategoryForm
          category={editingCategory ?? undefined}
          onClose={() => { setShowForm(false); setEditingCategory(null) }}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDelete}
        title="Delete category"
        message={`Delete ${deletingCategory?.name ?? 'this category'}? Existing expenses will keep historical category snapshots.`}
        confirmLabel="Delete"
        loading={deleteCategory.isPending}
      />
    </div>
  )
}
