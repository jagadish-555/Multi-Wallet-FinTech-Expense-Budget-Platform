import { expenseRepository } from '../repositories/expense.repository';
import { categoryRepository } from '../repositories/category.repository';
import { ApiError } from '../utils/ApiError';
import { appEvents, ExpenseAddedPayload } from '../events/eventEmitter';
import {
  CreateExpenseInput,
  UpdateExpenseInput,
  ExpenseFilterInput,
} from '../validators/expense.validator';

export class ExpenseService {
  // ─── List ──────────────────────────────────────────────────────────────────

  async getAll(userId: string, filters: ExpenseFilterInput) {
    return expenseRepository.findMany(userId, filters);
  }

  // ─── Get One ───────────────────────────────────────────────────────────────

  async getById(userId: string, expenseId: string) {
    const expense = await expenseRepository.findById(expenseId, userId);

    if (!expense) {
      throw ApiError.notFound('Expense not found');
    }

    return expense;
  }

  // ─── Create ────────────────────────────────────────────────────────────────

  async create(userId: string, input: CreateExpenseInput) {
    // Verify the category exists and is accessible to this user
    const category = await categoryRepository.findById(input.categoryId);

    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    const accessible = category.userId === userId || category.isSystem;
    if (!accessible) {
      throw ApiError.forbidden('You do not have access to that category');
    }

    const expense = await expenseRepository.create(userId, input);

    // Emit event — budget alert listener and analytics cache will hook in later
    const payload: ExpenseAddedPayload = {
      userId,
      expenseId:  expense.id,
      amount:     Number(expense.amountBase),
      categoryId: expense.categoryId,
      currency:   expense.currency,
    };
    appEvents.emit('expense.added', payload);

    return expense;
  }

  // ─── Update ────────────────────────────────────────────────────────────────

  async update(userId: string, expenseId: string, input: UpdateExpenseInput) {
    // Confirm ownership before touching the record
    await this.getById(userId, expenseId);

    // If categoryId is changing, verify the new category is accessible
    if (input.categoryId) {
      const category = await categoryRepository.findById(input.categoryId);

      if (!category) {
        throw ApiError.notFound('Category not found');
      }

      const accessible = category.userId === userId || category.isSystem;
      if (!accessible) {
        throw ApiError.forbidden('You do not have access to that category');
      }
    }

    return expenseRepository.update(expenseId, userId, input);
  }

  // ─── Delete (soft) ─────────────────────────────────────────────────────────

  async delete(userId: string, expenseId: string) {
    // Confirm ownership — findById only returns ACTIVE expenses for this user
    await this.getById(userId, expenseId);

    return expenseRepository.softDelete(expenseId);
  }
}

export const expenseService = new ExpenseService();
