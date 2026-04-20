import prisma from '../config/database';
import { CreateRecurringExpenseInput, UpdateRecurringExpenseInput } from '../validators/recurring.validator';

export class RecurringRepository {
  async findAllByUser(userId: string) {
    return prisma.recurringExpense.findMany({
      where: { userId },
      include: { category: { select: { id: true, name: true, icon: true, colorHex: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    return prisma.recurringExpense.findFirst({
      where: { id, userId },
      include: { category: { select: { id: true, name: true, icon: true, colorHex: true } } },
    });
  }

  async findDueSchedules(asOf: Date) {
    return prisma.recurringExpense.findMany({
      where: {
        isActive: true,
        nextDueDate: { lte: asOf },
        OR: [
          { endDate: null },
          { endDate: { gte: asOf } },
        ],
      },
    });
  }

  async create(userId: string, data: CreateRecurringExpenseInput, nextDueDate: Date) {
    return prisma.recurringExpense.create({
      data: {
        userId,
        categoryId:  data.categoryId,
        amount:      data.amount,
        currency:    data.currency,
        description: data.description,
        scheduleType: data.scheduleType,
        scheduleDay:  data.scheduleDay ?? null,
        startDate:    new Date(data.startDate),
        endDate:      data.endDate ? new Date(data.endDate) : null,
        isActive:     data.isActive,
        tags:         data.tags,
        nextDueDate,
      },
      include: { category: { select: { id: true, name: true, icon: true, colorHex: true } } },
    });
  }

  async update(id: string, data: UpdateRecurringExpenseInput, nextDueDate?: Date) {
    return prisma.recurringExpense.update({
      where: { id },
      data: {
        ...(data.categoryId  !== undefined && { categoryId: data.categoryId }),
        ...(data.amount      !== undefined && { amount: data.amount }),
        ...(data.currency    !== undefined && { currency: data.currency }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.scheduleType !== undefined && { scheduleType: data.scheduleType }),
        ...(data.scheduleDay !== undefined && { scheduleDay: data.scheduleDay }),
        ...(data.startDate   !== undefined && { startDate: new Date(data.startDate) }),
        ...(data.endDate     !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
        ...(data.tags        !== undefined && { tags: data.tags }),
        ...(nextDueDate      !== undefined && { nextDueDate }),
      },
      include: { category: { select: { id: true, name: true, icon: true, colorHex: true } } },
    });
  }

  async setActive(id: string, isActive: boolean) {
    return prisma.recurringExpense.update({
      where: { id },
      data: { isActive },
    });
  }

  async updateAfterTrigger(id: string, nextDueDate: Date) {
    return prisma.recurringExpense.update({
      where: { id },
      data: { lastTriggered: new Date(), nextDueDate },
    });
  }

  async delete(id: string) {
    return prisma.recurringExpense.delete({ where: { id } });
  }
}

export const recurringRepository = new RecurringRepository();
