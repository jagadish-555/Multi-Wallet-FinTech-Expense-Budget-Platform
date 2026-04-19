import prisma from '../config/database';
import { CreateBudgetInput, UpdateBudgetInput } from '../validators/budget.validator';

export class BudgetRepository {
  async findAllByUser(userId: string) {
    return prisma.budget.findMany({
      where: { userId, isActive: true },
      include: { category: { select: { id: true, name: true, icon: true, colorHex: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findById(id: string, userId: string) {
    return prisma.budget.findFirst({
      where: { id, userId },
      include: { category: { select: { id: true, name: true, icon: true, colorHex: true } } },
    });
  }

  async create(userId: string, data: CreateBudgetInput) {
    return prisma.budget.create({
      data: {
        userId,
        categoryId:  data.categoryId ?? null,
        limitAmount: data.limitAmount,
        currency:    data.currency,
        period:      data.period,
        periodDay:   data.periodDay ?? null,
        isActive:    data.isActive,
      },
      include: { category: { select: { id: true, name: true, icon: true, colorHex: true } } },
    });
  }

  async update(id: string, data: UpdateBudgetInput) {
    return prisma.budget.update({
      where: { id },
      data: {
        ...(data.categoryId  !== undefined && { categoryId: data.categoryId }),
        ...(data.limitAmount !== undefined && { limitAmount: data.limitAmount }),
        ...(data.currency    !== undefined && { currency: data.currency }),
        ...(data.period      !== undefined && { period: data.period }),
        ...(data.periodDay   !== undefined && { periodDay: data.periodDay }),
        ...(data.isActive    !== undefined && { isActive: data.isActive }),
      },
      include: { category: { select: { id: true, name: true, icon: true, colorHex: true } } },
    });
  }

  async delete(id: string) {
    return prisma.budget.delete({ where: { id } });
  }

  async getSpentAmount(userId: string, categoryId: string | null, from: Date, to: Date): Promise<number> {
    const result = await prisma.expense.aggregate({
      where: {
        userId,
        status: 'ACTIVE',
        expenseDate: { gte: from, lte: to },
        ...(categoryId ? { categoryId } : {}),
      },
      _sum: { amountBase: true },
    });

    return Number(result._sum.amountBase ?? 0);
  }
}

export const budgetRepository = new BudgetRepository();
