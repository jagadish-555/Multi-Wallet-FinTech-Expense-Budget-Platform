export interface RequestUser {
  id: string;
  email: string;
  currency: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface ExpenseFilters extends PaginationQuery {
  categoryId?: string;
  from?: string;
  to?: string;
  tags?: string[];
  status?: 'ACTIVE' | 'DELETED';
}

export interface BudgetWithUsage {
  id: string;
  categoryId: string | null;
  limitAmount: number;
  spentAmount: number;
  percentUsed: number;
  isExceeded: boolean;
  period: string;
}

export interface AnalyticsSummary {
  totalThisMonth: number;
  totalLastMonth: number;
  changePercent: number;
  topCategory: string | null;
  budgetHealth: 'good' | 'warning' | 'exceeded';
  expenseCount: number;
}

export interface JwtPayload {
  userId: string;
  email: string;
}
