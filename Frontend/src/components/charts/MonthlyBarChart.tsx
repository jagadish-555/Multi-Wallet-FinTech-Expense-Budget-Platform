import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'
import { useState } from 'react'
import type { MonthlyTrend } from '@/types'
import { useAuthStore } from '@/store/auth.store'
import { formatCurrency, formatMonthAbbr } from '@/lib/utils'

interface MonthlyBarChartProps {
  data: MonthlyTrend[]
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  const currency = useAuthStore.getState().user?.currency ?? 'INR'
  if (!active || !payload || payload.length === 0) return null
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-elevated)',
      }}
    >
      <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </p>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: 'var(--text-primary)', margin: 0 }}>
        {formatCurrency(payload[0].value, currency)}
      </p>
    </div>
  )
}

export default function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const currency = useAuthStore((s) => s.user?.currency ?? 'INR')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const formatted = data.map((d) => ({
    ...d,
    label: formatMonthAbbr(d.month + '-01'),
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={formatted} margin={{ top: 8, right: 8, left: 4, bottom: 4 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fontFamily: "'Sora', sans-serif", fontSize: 11, fill: 'var(--text-secondary)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontFamily: "'Sora', sans-serif", fontSize: 11, fill: 'var(--text-secondary)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => formatCurrency(v, currency)}
          width={72}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245,166,35,0.05)' }} />
        <Bar dataKey="total" radius={[4, 4, 0, 0]}>
          {formatted.map((_, index) => (
            <Cell
              key={index}
              fill={hoveredIndex === index ? '#f5a623' : 'rgba(245,166,35,0.85)'}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
