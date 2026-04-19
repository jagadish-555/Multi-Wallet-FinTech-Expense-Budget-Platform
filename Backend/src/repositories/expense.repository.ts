import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { getPagination, getPaginationMeta } from '../utils/pagination';
import { CreateExpenseInput, UpdateExpenseInput, ExpenseFilterInput } from '../validators/expense.validator';

export class ExpenseRepository {
  private buildWhere(userId: string, filters: ExpenseFilterInput): Prisma.ExpenseWhereInput {
    const { categoryId, from, to, tags } = filters;

    return {
      userId,
      status: 'ACTIVE',
      ...(categoryId && { categoryId }),
      ...(from || to
        ? {
            expenseDate: {
              ...(from && { gte: new Date(from) }),
              ...(to && { lte: new Date(to) }),
            },
          }
        : {}),
      ...(tags && tags.length > 0
        ? {
            AND: tags.map((tag) => ({
              tags: { path: '$', array_contains: tag },
            })),
          }
        : {}),
    };
  }

  async findMany(userId: string, filters: ExpenseFilterInput) {
    const { page, limit } = filters;
    const { take, skip } = getPagination(page, limit);
    const where = this.buildWhere(userId, filters);

    const [expenses, total] = await prisma.$transaction([
      prisma.expense.findMany({
        where,
        take,
        skip,
        orderBy: { expenseDate: 'desc' },
        include: { category: { select: { id: true, name: true, icon: true, colorHex: true } } },
      }),
      prisma.expense.count({ where }),
    ]);

    return {
      expenses,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  async findById(id: string, userId: string) {
    return prisma.expense.findFirst({
      where: { id, userId, status: 'ACTIVE' },
      include: { category: { select: { id: true, name: true, icon: true, colorHex: true } } },
    });
  }

  async create(userId: string, data: CreateExpenseInput) {
    return prisma.expense.create({
      data: {
        userId,
        categoryId:  data.categoryId,
        amount:      data.amount,
        amountBase:  data.amount,
        currency:    data.currency,
        description: data.description,
        expenseDate: new Date(data.expenseDate),
        tags:        data.tags,
        ...(data.recurringId ? { recurringId: data.recurringId } : {}),
      },
      include: { category: { select: { id: true, name: true, icon: true, colorHex: true } } },
    });
  }

  async update(id: string, userId: string, data: UpdateExpenseInput) {
    return prisma.expense.update({
      where: { id },
      data: {
        ...(data.categoryId  !== undefined && { categoryId: data.categoryId }),
        ...(data.amount      !== undefined && { amount: data.amount, amountBase: data.amount }),
        ...(data.currency    !== undefined && { currency: data.currency }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.expenseDate !== undefined && { expenseDate: new Date(data.expenseDate) }),
        ...(data.tags        !== undefined && { tags: data.tags }),
      },
      include: { category: { select: { id: true, name: true, icon: true, colorHex: true } } },
    });
  }

  async softDelete(id: string) {
    return prisma.expense.update({
      where: { id },
      data: { status: 'DELETED' },
    });
  }

  async sumByCategory(userId: string, from: Date, to: Date) {
    return prisma.expense.groupBy({
      by: ['categoryId'],
      where: { userId, status: 'ACTIVE', expenseDate: { gte: from, lte: to } },
      _sum: { amountBase: true },
      orderBy: { _sum: { amountBase: 'desc' } },
    });
  }

  async sumTotal(userId: string, from: Date, to: Date): Promise<number> {
    const result = await prisma.expense.aggregate({
      where: { userId, status: 'ACTIVE', expenseDate: { gte: from, lte: to } },
      _sum: { amountBase: true },
    });
    return Number(result._sum.amountBase ?? 0);
  }

  async sumByMonth(userId: string, months: number): Promise<{ month: string; total: number }[]> {
    const from = new Date();
    from.setMonth(from.getMonth() - (months - 1));
    from.setDate(1);
    from.setHours(0, 0, 0, 0);

    const rows = await prisma.$queryRaw<{ month: string; total: number }[]>`
      SELECT
        DATE_FORMAT(expense_date, '%Y-%m') AS month,
        CAST(SUM(amount_base) AS DECIMAL(12,2)) AS total
      FROM expenses
      WHERE user_id = ${userId}
        AND status = 'ACTIVE'
        AND expense_date >= ${from}
      GROUP BY month
      ORDER BY month ASC
    `;

    return rows.map((r) => ({ month: r.month, total: Number(r.total) }));
  }
}

export const expenseRepository = new ExpenseRepository();
