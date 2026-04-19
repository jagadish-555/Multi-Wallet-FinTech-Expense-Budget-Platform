export interface User {
  id: string
  email: string
  name: string
  currency: string
  timezone: string
  avatarUrl?: string
}

export interface Category {
  id: string
  userId: string
  name: string
  icon: string
  colorHex: string
  parentId?: string
  isSystem: boolean
}

export interface Expense {
  id: string
  userId: string
  categoryId: string
  category: Category
  amount: number
  currency: string
  amountBase: number
  description: string
  expenseDate: string
  status: 'ACTIVE' | 'DELETED'
  tags: string[]
  createdAt: string
}

export interface Budget {
  id: string
  userId: string
  categoryId?: string
  category?: Category
  limitAmount: number
  currency: string
  period: 'MONTHLY' | 'ROLLING_30' | 'PAYCHECK'
  periodDay: number
  isActive: boolean
}

export interface BudgetWithUsage extends Budget {
  spentAmount: number
  percentUsed: number
  isExceeded: boolean
}

export interface RecurringExpense {
  id: string
  userId: string
  categoryId: string
  category: Category
  amount: number
  currency: string
  description: string
  scheduleType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  scheduleDay?: number
  startDate: string
  endDate?: string
  nextDueDate: string
  lastTriggered?: string
  isActive: boolean
}

export interface Notification {
  id: string
  userId: string
  type: 'BUDGET_ALERT' | 'RECURRING_DUE' | 'SPLIT_REQUEST' | 'SYSTEM'
  title: string
  message: string
  metadata: Record<string, unknown>
  isRead: boolean
  createdAt: string
}

export interface AnalyticsSummary {
  totalThisMonth: number
  totalLastMonth: number
  changePercent: number
  topCategory: string | null
  budgetHealth: 'good' | 'warning' | 'exceeded'
  expenseCount: number
}

export interface CategorySpending {
  categoryId: string
  categoryName: string
  color: string
  total: number
}

export interface MonthlyTrend {
  month: string
  total: number
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ExpenseFilters {
  categoryId?: string
  from?: string
  to?: string
  tags?: string
  page?: number
  limit?: number
  description?: string
}
