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
  async getAll(userId: string, filters: ExpenseFilterInput) {
    return expenseRepository.findMany(userId, filters);
  }

  async getById(userId: string, expenseId: string) {
    const expense = await expenseRepository.findById(expenseId, userId);

    if (!expense) {
      throw ApiError.notFound('Expense not found');
    }

    return expense;
  }

  async create(userId: string, input: CreateExpenseInput) {
    const category = await categoryRepository.findById(input.categoryId);

    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    const accessible = category.userId === userId || category.isSystem;
    if (!accessible) {
      throw ApiError.forbidden('You do not have access to that category');
    }

    const expense = await expenseRepository.create(userId, input);

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

  async update(userId: string, expenseId: string, input: UpdateExpenseInput) {
    await this.getById(userId, expenseId);

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

  async delete(userId: string, expenseId: string) {
    await this.getById(userId, expenseId);

    return expenseRepository.softDelete(expenseId);
  }
}

export const expenseService = new ExpenseService();
