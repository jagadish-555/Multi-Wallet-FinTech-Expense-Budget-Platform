import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { CategorySpending } from '@/types'
import { useAuthStore } from '@/store/auth.store'
import { formatCurrency } from '@/lib/utils'

interface SpendingPieChartProps {
  data: CategorySpending[]
}

const CHART_COLORS = [
  '#f5a623', '#60a5fa', '#34d399', '#f472b6',
  '#a78bfa', '#fb923c', '#38bdf8', '#4ade80',
]

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: CategorySpending }> }) {
  const currency = useAuthStore.getState().user?.currency ?? 'INR'
  if (!active || !payload || payload.length === 0) return null
  const item = payload[0]
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
      <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>
        {item.name}
      </p>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: 'var(--text-primary)', margin: 0 }}>
        {formatCurrency(item.value, currency)}
      </p>
    </div>
  )
}

export default function SpendingPieChart({ data }: SpendingPieChartProps) {
  const currency = useAuthStore((s) => s.user?.currency ?? 'INR')
  const total = data.reduce((sum, d) => sum + d.total, 0)

  return (
    <div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="categoryName"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60}
            paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.color ?? CHART_COLORS[i % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Donut center total */}
      <div style={{ textAlign: 'center', marginTop: '-60px', pointerEvents: 'none', position: 'relative', zIndex: 1 }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
          {formatCurrency(total, currency)}
        </p>
        <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '11px', color: 'var(--text-tertiary)', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Total
        </p>
      </div>

      {/* Custom legend */}
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.map((entry, i) => {
          const pct = total > 0 ? ((entry.total / total) * 100).toFixed(0) : '0'
          const color = entry.color ?? CHART_COLORS[i % CHART_COLORS.length]
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  flexShrink: 0,
                }}
              />
              <span style={{ flex: 1, fontFamily: "'Sora', sans-serif", fontSize: '12px', color: 'var(--text-secondary)' }}>
                {entry.categoryName}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'var(--text-secondary)' }}>
                {pct}%
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'var(--text-primary)', minWidth: '80px', textAlign: 'right' }}>
                {formatCurrency(entry.total, currency)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
