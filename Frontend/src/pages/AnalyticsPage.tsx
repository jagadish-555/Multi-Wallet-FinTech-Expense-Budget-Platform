import { useMemo, useState } from 'react'
import { subDays, format } from 'date-fns'
import { useAnalyticsSummary, useAnalyticsByCategory, useMonthlyTrend } from '@/hooks/useAnalytics'
import { useAuthStore } from '@/store/auth.store'
import { formatCurrency } from '@/lib/utils'
import SpendingPieChart from '@/components/charts/SpendingPieChart'
import MonthlyBarChart from '@/components/charts/MonthlyBarChart'
import Skeleton from '@/components/ui/Skeleton'
import ErrorState from '@/components/ui/ErrorState'
import Badge from '@/components/ui/Badge'
import { TrendingUp, TrendingDown } from 'lucide-react'

const PRESETS = [
  { label: 'This Month', days: 30 },
  { label: 'Last Month', days: 60 },
  { label: 'Last 3 Months', days: 90 },
  { label: 'Last 6 Months', days: 180 },
  { label: 'This Year', days: 365 },
]

const CARD: React.CSSProperties = {
  backgroundColor: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  boxShadow: 'var(--shadow-card)',
}

export default function AnalyticsPage() {
  const today = useMemo(() => format(new Date(), 'yyyy-MM-dd'), [])
  const defaultFrom = useMemo(() => format(subDays(new Date(), 30), 'yyyy-MM-dd'), [])
  const currency = useAuthStore((s) => s.user?.currency ?? 'INR')

  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(today)
  const [activePreset, setActivePreset] = useState(0)

  const summary = useAnalyticsSummary()
  const byCategory = useAnalyticsByCategory({ from, to })
  const trend = useMonthlyTrend({ months: 12 })

  const CHART_COLORS = ['#f5a623', '#60a5fa', '#34d399', '#f472b6', '#a78bfa', '#fb923c', '#38bdf8', '#4ade80']

  const handlePreset = (index: number, days: number) => {
    setActivePreset(index)
    const newFrom = format(subDays(new Date(), days), 'yyyy-MM-dd')
    setFrom(newFrom)
    setTo(today)
  }

  const totalInRange = byCategory.data?.reduce((s, c) => s + c.total, 0) ?? 0
  const sorted = byCategory.data ? [...byCategory.data].sort((a, b) => b.total - a.total) : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Date range selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Preset pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => handlePreset(i, p.days)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              <Badge variant={activePreset === i ? 'accent' : 'neutral'} style={{ cursor: 'pointer', fontSize: '12px', padding: '4px 12px' }}>
                {p.label}
              </Badge>
            </button>
          ))}
        </div>

        {/* Custom date inputs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="date"
            value={from}
            onChange={(e) => { setFrom(e.target.value); setActivePreset(-1) }}
            className="input-dark"
            style={{ width: 'auto', flex: 1, maxWidth: '180px', colorScheme: 'dark' }}
          />
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '13px', color: 'var(--text-tertiary)' }}>—</span>
          <input
            type="date"
            value={to}
            onChange={(e) => { setTo(e.target.value); setActivePreset(-1) }}
            className="input-dark"
            style={{ width: 'auto', flex: 1, maxWidth: '180px', colorScheme: 'dark' }}
          />
        </div>
      </div>

      {/* Summary metrics */}
      {summary.data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div style={CARD}>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', margin: '0 0 10px' }}>
              This Month
            </p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 6px' }}>
              {formatCurrency(summary.data.totalThisMonth, currency)}
            </p>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
              {summary.data.expenseCount} transactions
            </p>
          </div>

          <div style={CARD}>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', margin: '0 0 10px' }}>
              MoM Change
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              {summary.data.changePercent > 0
                ? <TrendingUp size={18} style={{ color: 'var(--danger)' }} />
                : <TrendingDown size={18} style={{ color: 'var(--success)' }} />
              }
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
                {Math.abs(summary.data.changePercent).toFixed(1)}%
              </p>
            </div>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
              vs last month
            </p>
          </div>

          <div style={CARD}>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', margin: '0 0 10px' }}>
              Budget Health
            </p>
            <div style={{ marginBottom: '6px' }}>
              <Badge
                variant={summary.data.budgetHealth === 'good' ? 'success' : summary.data.budgetHealth === 'warning' ? 'warning' : 'danger'}
                style={{ fontSize: '13px', padding: '5px 14px' }}
              >
                {summary.data.budgetHealth === 'good' ? 'On Track' : summary.data.budgetHealth === 'warning' ? 'Warning' : 'Exceeded'}
              </Badge>
            </div>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
              current month
            </p>
          </div>
        </div>
      )}

      {/* Full-width trend chart */}
      <div style={CARD}>
        <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>
          Monthly Spending Trend
        </h3>
        {trend.isLoading ? (
          <Skeleton style={{ height: '280px' }} />
        ) : trend.isError ? (
          <ErrorState onRetry={() => trend.refetch()} />
        ) : trend.data && trend.data.length > 0 ? (
          <MonthlyBarChart data={trend.data} />
        ) : (
          <p style={{ fontFamily: "'Sora'", fontSize: '14px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '60px 0', margin: 0 }}>
            No trend data available.
          </p>
        )}
      </div>

      {/* Two-column: pie + category breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div style={CARD}>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>
            Category Breakdown
          </h3>
          {byCategory.isLoading ? (
            <Skeleton style={{ height: '280px' }} />
          ) : byCategory.isError ? (
            <ErrorState onRetry={() => byCategory.refetch()} />
          ) : byCategory.data && byCategory.data.length > 0 ? (
            <SpendingPieChart data={byCategory.data} />
          ) : (
            <p style={{ fontFamily: "'Sora'", fontSize: '14px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '60px 0', margin: 0 }}>
              No spending in selected range.
            </p>
          )}
        </div>

        {/* Category table */}
        <div style={CARD}>
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>
            Top Spending
          </h3>
          {sorted.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {sorted.slice(0, 8).map((cat, i) => {
                const pct = totalInRange > 0 ? (cat.total / totalInRange) * 100 : 0
                const color = cat.color ?? CHART_COLORS[i % CHART_COLORS.length]
                return (
                  <div
                    key={cat.categoryName}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 8px',
                      borderRadius: 'var(--radius-sm)',
                      transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-elevated)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = '' }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '13px', color: 'var(--text-primary)', flex: 1 }}>
                      {cat.categoryName}
                    </span>
                    {/* Mini bar */}
                    <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--bg-overlay)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--accent)', borderRadius: '2px' }} />
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'var(--text-primary)', minWidth: '80px', textAlign: 'right' }}>
                      {formatCurrency(cat.total, currency)}
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'var(--text-secondary)', minWidth: '36px', textAlign: 'right' }}>
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p style={{ fontFamily: "'Sora'", fontSize: '14px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '40px 0', margin: 0 }}>
              No data for selected range.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
