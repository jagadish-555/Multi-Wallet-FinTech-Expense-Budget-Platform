import prisma from '../config/database';
import { expenseRepository } from '../repositories/expense.repository';
import { budgetService } from './budget.service';

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export class AnalyticsService {
  async getSummary(userId: string) {
    const now = new Date();

    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd   = endOfMonth(now);

    const lastMonthDate  = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthStart = startOfMonth(lastMonthDate);
    const lastMonthEnd   = endOfMonth(lastMonthDate);

    const [totalThisMonth, totalLastMonth, categoryBreakdown, budgets] = await Promise.all([
      expenseRepository.sumTotal(userId, thisMonthStart, thisMonthEnd),
      expenseRepository.sumTotal(userId, lastMonthStart, lastMonthEnd),
      expenseRepository.sumByCategory(userId, thisMonthStart, thisMonthEnd),
      budgetService.getAllWithUsage(userId),
    ]);

    const changePercent = totalLastMonth === 0
      ? 100
      : Math.round(((totalThisMonth - totalLastMonth) / totalLastMonth) * 100);

    let topCategoryName: string | null = null;
    if (categoryBreakdown.length > 0) {
      const topCategoryId = categoryBreakdown[0].categoryId;
      const category = await prisma.category.findUnique({
        where: { id: topCategoryId },
        select: { name: true },
      });
      topCategoryName = category?.name ?? null;
    }

    const budgetHealth = budgets.some((b) => b.isExceeded)
      ? 'exceeded'
      : budgets.some((b) => b.percentUsed >= 80)
      ? 'warning'
      : 'good';

    const expenseCount = await prisma.expense.count({
      where: { userId, status: 'ACTIVE', expenseDate: { gte: thisMonthStart, lte: thisMonthEnd } },
    });

    return {
      totalThisMonth,
      totalLastMonth,
      changePercent,
      topCategory: topCategoryName,
      budgetHealth,
      expenseCount,
    };
  }

  async getByCategory(userId: string, from: string, to: string) {
    const fromDate = new Date(from);
    const toDate   = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    const breakdown = await expenseRepository.sumByCategory(userId, fromDate, toDate);

    const categoryIds = breakdown.map((r) => r.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, icon: true, colorHex: true },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    return breakdown.map((row) => ({
      categoryId: row.categoryId,
      category:   categoryMap.get(row.categoryId) ?? null,
      total:      Number(row._sum.amountBase ?? 0),
    }));
  }

  async getMonthlyTrend(userId: string, months: number = 6) {
    const clampedMonths = Math.min(Math.max(months, 1), 24);
    return expenseRepository.sumByMonth(userId, clampedMonths);
  }
}

export const analyticsService = new AnalyticsService();
