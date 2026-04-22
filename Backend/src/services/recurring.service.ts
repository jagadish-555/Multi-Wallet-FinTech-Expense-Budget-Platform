import { recurringRepository } from '../repositories/recurring.repository';
import { categoryRepository } from '../repositories/category.repository';
import { ApiError } from '../utils/ApiError';
import { CreateRecurringExpenseInput, UpdateRecurringExpenseInput } from '../validators/recurring.validator';
import { ScheduleType } from '@prisma/client';

export function computeNextDueDate(from: Date, scheduleType: ScheduleType, scheduleDay?: number | null): Date {
  const next = new Date(from);

  switch (scheduleType) {
    case 'DAILY':
      next.setDate(next.getDate() + 1);
      break;

    case 'WEEKLY':
      next.setDate(next.getDate() + 7);
      break;

    case 'MONTHLY': {
      const targetDay = scheduleDay || from.getDate();
      next.setDate(1); // Prevent overflow during month shift
      next.setMonth(next.getMonth() + 1);
      const maxDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
      next.setDate(Math.min(targetDay, maxDay));
      break;
    }

    case 'YEARLY':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }

  return next;
}

export class RecurringService {
  async getAll(userId: string) {
    return recurringRepository.findAllByUser(userId);
  }

  async getById(userId: string, id: string) {
    const schedule = await recurringRepository.findById(id, userId);
    if (!schedule) throw ApiError.notFound('Recurring expense not found');
    return schedule;
  }

  async create(userId: string, input: CreateRecurringExpenseInput) {
    const category = await categoryRepository.findById(input.categoryId);
    if (!category) throw ApiError.notFound('Category not found');

    const accessible = category.userId === userId || category.isSystem;
    if (!accessible) throw ApiError.forbidden('You do not have access to that category');

    const startDate    = new Date(input.startDate);
    const nextDueDate  = startDate; // Process it on the start date first!

    // Prevent date drift for MONTHLY schedules
    if (input.scheduleType === 'MONTHLY' && input.scheduleDay == null) {
      input.scheduleDay = startDate.getDate();
    }

    return recurringRepository.create(userId, input, nextDueDate);
  }

  async update(userId: string, id: string, input: UpdateRecurringExpenseInput) {
    const existing = await this.getById(userId, id);

    if (input.categoryId) {
      const category = await categoryRepository.findById(input.categoryId);
      if (!category) throw ApiError.notFound('Category not found');
      const accessible = category.userId === userId || category.isSystem;
      if (!accessible) throw ApiError.forbidden('You do not have access to that category');
    }

    let nextDueDate: Date | undefined;
    if (input.scheduleType || input.scheduleDay !== undefined || input.startDate) {
      const baseDate = input.startDate ? new Date(input.startDate) : (existing.lastTriggered || existing.startDate);
      const scheduleType = input.scheduleType || existing.scheduleType;
      const scheduleDay = input.scheduleDay !== undefined ? input.scheduleDay : existing.scheduleDay;
      
      nextDueDate = input.startDate ? new Date(input.startDate) : computeNextDueDate(baseDate, scheduleType, scheduleDay);
    }

    return recurringRepository.update(id, input, nextDueDate);
  }

  async pause(userId: string, id: string) {
    await this.getById(userId, id);
    return recurringRepository.setActive(id, false);
  }

  async resume(userId: string, id: string) {
    await this.getById(userId, id);
    return recurringRepository.setActive(id, true);
  }

  async delete(userId: string, id: string) {
    await this.getById(userId, id);
    return recurringRepository.delete(id);
  }
}

export const recurringService = new RecurringService();
