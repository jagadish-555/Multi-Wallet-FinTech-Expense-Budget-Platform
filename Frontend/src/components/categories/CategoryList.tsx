import type { Category } from '@/types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { Tags, Pencil, Trash2 } from 'lucide-react'
import * as Icons from 'lucide-react'


const DynamicIcon = ({ name, color }: { name: string, color: string }) => {
  const toPascalCase = (str: string) => str.replace(/(^\w|-\w)/g, (clearAndDir) => clearAndDir.replace(/-/, "").toUpperCase());
  
  const IconComponent = (Icons as any)[toPascalCase(name)] || Icons.Tags;
  
  return <IconComponent size={20} color={color} />;
}

interface CategoryListProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export default function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <EmptyState
        icon={Tags}
        title="No categories yet"
        description="Create your first custom category to organize expenses faster."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {categories.map((category) => (
        <div key={category.id} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0"
                style={{ backgroundColor: `${category.colorHex}22` }}
              >
                <DynamicIcon name={category.icon || 'tags'} color={category.colorHex} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{category.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={category.isSystem ? 'info' : 'neutral'}>
                    {category.isSystem ? 'System' : 'Custom'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {!category.isSystem && (
            <div className="mt-4 flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => onEdit(category)}>
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={() => onDelete(category)}>
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
