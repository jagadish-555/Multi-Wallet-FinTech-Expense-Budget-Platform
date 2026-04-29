import { useState, useEffect, useRef } from 'react'
import type { Category } from '@/types'
import { Search, X } from 'lucide-react'

interface ExpenseFiltersProps {
  categories: Category[]
  onFiltersChange: (filters: {
    from: string
    to: string
    categoryId: string
    description: string
  }) => void
}

export default function ExpenseFilters({ categories, onFiltersChange }: ExpenseFiltersProps) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onFiltersChange({ from, to, categoryId, description })
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [from, to, categoryId, description, onFiltersChange])

  const clearAll = () => {
    setFrom('')
    setTo('')
    setCategoryId('')
    setDescription('')
  }

  const hasFilters = from || to || categoryId || description

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* From */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label className="label-dark">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="input-dark"
            style={{ colorScheme: 'dark' }}
          />
        </div>

        {/* To */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label className="label-dark">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="input-dark"
            style={{ colorScheme: 'dark' }}
          />
        </div>

        {/* Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label className="label-dark">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="select-dark"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label className="label-dark">Search</label>
          <div style={{ position: 'relative' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Description…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-dark"
              style={{ paddingLeft: '32px' }}
            />
          </div>
        </div>
      </div>

      {hasFilters && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={clearAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              fontFamily: "'Sora', sans-serif",
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: 'var(--radius-sm)',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-tertiary)' }}
          >
            <X size={12} />
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
