import { budgetRepository } from '../repositories/budget.repository';
import { ApiError } from '../utils/ApiError';
import { CreateBudgetInput, UpdateBudgetInput } from '../validators/budget.validator';

interface DateRange {
  from: Date;
  to: Date;
}

interface IBudgetStrategy {
  getDateRange(periodDay?: number | null): DateRange;
}

class MonthlyStrategy implements IBudgetStrategy {
  getDateRange(periodDay: number | null = 1): DateRange {
    const day = periodDay ?? 1;
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), day);

    if (now.getDate() < day) {
      from.setMonth(from.getMonth() - 1);
    }

    const to = new Date(from);
    to.setMonth(to.getMonth() + 1);
    to.setDate(to.getDate() - 1);
    to.setHours(23, 59, 59, 999);

    return { from, to };
  }
}

class Rolling30Strategy implements IBudgetStrategy {
  getDateRange(): DateRange {
    const to = new Date();
    to.setHours(23, 59, 59, 999);

    const from = new Date();
    from.setDate(from.getDate() - 29);
    from.setHours(0, 0, 0, 0);

    return { from, to };
  }
}

class PaycheckStrategy implements IBudgetStrategy {
  getDateRange(periodDay: number | null = 1): DateRange {
    const day = periodDay ?? 1;
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), day);

    if (now.getDate() < day) {
      from.setMonth(from.getMonth() - 1);
    }

    const to = new Date(from);
    to.setMonth(to.getMonth() + 1);
    to.setDate(to.getDate() - 1);
    to.setHours(23, 59, 59, 999);

    return { from, to };
  }
}

function getStrategy(period: string): IBudgetStrategy {
  switch (period) {
    case 'MONTHLY':    return new MonthlyStrategy();
    case 'ROLLING_30': return new Rolling30Strategy();
    case 'PAYCHECK':   return new PaycheckStrategy();
    default:           return new MonthlyStrategy();
  }
}

export class BudgetService {
  async getAllWithUsage(userId: string) {
    const budgets = await budgetRepository.findAllByUser(userId);

    const enriched = await Promise.all(
      budgets.map(async (budget) => {
        const strategy = getStrategy(budget.period);
        const { from, to } = strategy.getDateRange(budget.periodDay);

        const spentAmount = await budgetRepository.getSpentAmount(
          userId,
          budget.categoryId,
          from,
          to
        );

        const limitAmount  = Number(budget.limitAmount);
        const percentUsed  = limitAmount > 0 ? Math.round((spentAmount / limitAmount) * 100) : 0;
        const isExceeded   = spentAmount > limitAmount;

        return {
          ...budget,
          limitAmount,
          spentAmount,
          percentUsed,
          isExceeded,
          periodFrom: from,
          periodTo:   to,
        };
      })
    );

    return enriched;
  }

  async create(userId: string, input: CreateBudgetInput) {
    const existing = await this.findExistingBudget(userId, input.categoryId ?? null);

    if (existing) {
      const scope = input.categoryId ? 'this category' : 'overall spending';
      throw ApiError.conflict(`A budget for ${scope} already exists`);
    }

    return budgetRepository.create(userId, input);
  }

  async update(userId: string, budgetId: string, input: UpdateBudgetInput) {
    await this.getOwnedBudget(userId, budgetId);

    return budgetRepository.update(budgetId, input);
  }

  async delete(userId: string, budgetId: string) {
    await this.getOwnedBudget(userId, budgetId);

    return budgetRepository.delete(budgetId);
  }

  private async getOwnedBudget(userId: string, budgetId: string) {
    const budget = await budgetRepository.findById(budgetId, userId);

    if (!budget) {
      throw ApiError.notFound('Budget not found');
    }

    return budget;
  }

  private async findExistingBudget(userId: string, categoryId: string | null) {
    const budgets = await budgetRepository.findAllByUser(userId);

    return budgets.find((b) =>
      categoryId ? b.categoryId === categoryId : b.categoryId === null
    );
  }
}

export const budgetService = new BudgetService();
