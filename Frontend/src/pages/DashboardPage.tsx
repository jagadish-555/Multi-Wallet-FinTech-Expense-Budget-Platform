import { useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAnalyticsSummary, useAnalyticsByCategory, useMonthlyTrend } from '@/hooks/useAnalytics'
import { useBudgets } from '@/hooks/useBudgets'
import { useExpenses } from '@/hooks/useExpenses'
import { useAuthStore } from '@/store/auth.store'
import { formatCurrency, formatDate } from '@/lib/utils'
import SpendingPieChart from '@/components/charts/SpendingPieChart'
import MonthlyBarChart from '@/components/charts/MonthlyBarChart'
import BudgetProgressBar from '@/components/charts/BudgetProgressBar'
import Skeleton from '@/components/ui/Skeleton'
import ErrorState from '@/components/ui/ErrorState'
import Badge from '@/components/ui/Badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function useCountUp(target: number, duration = 1000) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!ref.current || target === 0) return
    const start = performance.now()
    function step(now: number) {
      if (!ref.current) return
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const value = Math.round(easeOutCubic(progress) * target)
      ref.current.textContent = value.toLocaleString('en-IN')
      if (progress < 1) requestAnimationFrame(step)
      else ref.current.textContent = target.toLocaleString('en-IN')
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return ref
}

const CARD_STYLE: React.CSSProperties = {
  backgroundColor: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  boxShadow: 'var(--shadow-card)',
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const currency = user?.currency ?? 'INR'

  const summary = useAnalyticsSummary()
  const byCat = useAnalyticsByCategory({})
  const trend = useMonthlyTrend({ months: 6 })
  const budgets = useBudgets()
  const recentExpenses = useExpenses({ limit: 5, page: 1 })

  const changeAbs = useMemo(() => {
    if (!summary.data) return 0
    return summary.data.totalThisMonth - summary.data.totalLastMonth
  }, [summary.data])

  const thisMonth = summary.data?.totalThisMonth ?? 0
  const txCount = summary.data?.expenseCount ?? 0
  const countRef = useCountUp(txCount)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {summary.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="card" />)
        ) : summary.isError ? (
          <div style={{ gridColumn: '1 / -1' }}>
            <ErrorState onRetry={() => summary.refetch()} />
          </div>
        ) : summary.data ? (
          <>
            {/* Card 1 — This Month */}
            <div style={CARD_STYLE} className="stagger-1">
              <p
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--text-secondary)',
                  margin: '0 0 12px',
                }}
              >
                This Month
              </p>
              <div className="metric-value" style={{ fontSize: '28px' }}>
                {formatCurrency(thisMonth, currency)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                {changeAbs > 0 ? (
                  <TrendingUp size={13} style={{ color: 'var(--danger)' }} />
                ) : changeAbs < 0 ? (
                  <TrendingDown size={13} style={{ color: 'var(--success)' }} />
                ) : (
                  <Minus size={13} style={{ color: 'var(--text-tertiary)' }} />
                )}
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    color: changeAbs > 0 ? 'var(--danger)' : changeAbs < 0 ? 'var(--success)' : 'var(--text-tertiary)',
                  }}
                >
                  {Math.abs(summary.data.changePercent).toFixed(1)}% vs last month
                </span>
              </div>
            </div>

            {/* Card 2 — Transactions */}
            <div style={CARD_STYLE} className="stagger-2">
              <p
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--text-secondary)',
                  margin: '0 0 12px',
                }}
              >
                Transactions
              </p>
              <div className="metric-value">
                <span ref={countRef}>{txCount.toLocaleString('en-IN')}</span>
              </div>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '12px', color: 'var(--text-tertiary)', margin: '8px 0 0' }}>
                this month
              </p>
            </div>

            {/* Card 3 — Top Category */}
            <div style={CARD_STYLE} className="stagger-3">
              <p
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--text-secondary)',
                  margin: '0 0 12px',
                }}
              >
                Top Category
              </p>
              <p
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {summary.data.topCategory ?? '—'}
              </p>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '12px', color: 'var(--text-tertiary)', margin: '8px 0 0' }}>
                highest spending
              </p>
            </div>

            {/* Card 4 — Budget Health */}
            <div style={CARD_STYLE} className="stagger-4">
              <p
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--text-secondary)',
                  margin: '0 0 12px',
                }}
              >
                Budget Status
              </p>
              <div style={{ marginBottom: '8px' }}>
                <Badge
                  variant={
                    summary.data.budgetHealth === 'good'
                      ? 'success'
                      : summary.data.budgetHealth === 'warning'
                      ? 'warning'
                      : 'danger'
                  }
                  style={{ fontSize: '13px', padding: '5px 14px' }}
                >
                  {summary.data.budgetHealth === 'good'
                    ? 'On Track'
                    : summary.data.budgetHealth === 'warning'
                    ? 'Warning'
                    : 'Exceeded'}
                </Badge>
              </div>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '12px', color: 'var(--text-tertiary)', margin: 0 }}>
                current month
              </p>
            </div>
          </>
        ) : null}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div style={CARD_STYLE}>
          <h2
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: '0 0 20px',
            }}
          >
            Spending by Category
          </h2>
          {byCat.isLoading ? (
            <Skeleton style={{ height: '280px' }} />
          ) : byCat.isError ? (
            <ErrorState onRetry={() => byCat.refetch()} />
          ) : byCat.data && byCat.data.length > 0 ? (
            <SpendingPieChart data={byCat.data} />
          ) : (
            <div
              style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Sora', sans-serif",
                fontSize: '14px',
                color: 'var(--text-tertiary)',
              }}
            >
              No spending data yet
            </div>
          )}
        </div>

        <div style={CARD_STYLE}>
          <h2
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: '0 0 20px',
            }}
          >
            Monthly Spending
          </h2>
          {trend.isLoading ? (
            <Skeleton style={{ height: '280px' }} />
          ) : trend.isError ? (
            <ErrorState onRetry={() => trend.refetch()} />
          ) : trend.data && trend.data.length > 0 ? (
            <MonthlyBarChart data={trend.data} />
          ) : (
            <div
              style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Sora', sans-serif",
                fontSize: '14px',
                color: 'var(--text-tertiary)',
              }}
            >
              No trend data yet
            </div>
          )}
        </div>
      </div>

      {/* Budget Overview */}
      {budgets.data && budgets.data.length > 0 && (
        <div style={CARD_STYLE}>
          <h2
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: '0 0 20px',
            }}
          >
            Budget Overview
          </h2>
          {budgets.isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} style={{ height: '36px' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {budgets.data.map((b) => (
                <BudgetProgressBar key={b.id} budget={b} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Transactions */}
      <div style={CARD_STYLE}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Recent Transactions
          </h2>
          <Link
            to="/expenses"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            View All →
          </Link>
        </div>

        {recentExpenses.isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} style={{ height: '44px' }} />
            ))}
          </div>
        ) : recentExpenses.data?.expenses && recentExpenses.data.expenses.length > 0 ? (
          <div>
            {recentExpenses.data.expenses.map((e) => (
              <div
                key={e.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {/* Category dot */}
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: e.category?.colorHex ?? '#f5a623',
                    flexShrink: 0,
                  }}
                />
                {/* Description */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {e.description}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: '11px',
                      color: 'var(--text-tertiary)',
                      margin: '2px 0 0',
                    }}
                  >
                    {e.category?.name}
                  </p>
                </div>
                {/* Right side */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    {formatCurrency(e.amount, e.currency)}
                  </p>
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11px',
                      color: 'var(--text-tertiary)',
                      margin: '2px 0 0',
                    }}
                  >
                    {formatDate(e.expenseDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '14px',
              color: 'var(--text-tertiary)',
              textAlign: 'center',
              padding: '32px 0',
              margin: 0,
            }}
          >
            No expenses yet
          </p>
        )}
      </div>
    </div>
  )
}
