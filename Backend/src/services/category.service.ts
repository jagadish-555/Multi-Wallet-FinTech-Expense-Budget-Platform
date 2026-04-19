import { categoryRepository } from '../repositories/category.repository';
import { ApiError } from '../utils/ApiError';
import { CreateCategoryInput, UpdateCategoryInput } from '../validators/category.validator';

export class CategoryService {
  // ─── List ──────────────────────────────────────────────────────────────────

  async getAll(userId: string) {
    return categoryRepository.findAllByUser(userId);
  }

  // ─── Create ────────────────────────────────────────────────────────────────

  async create(userId: string, input: CreateCategoryInput) {
    // If a parentId is provided, verify the parent exists and belongs to this user
    if (input.parentId) {
      const parent = await categoryRepository.findById(input.parentId);

      if (!parent) {
        throw ApiError.notFound('Parent category not found');
      }

      const ownedByUser = parent.userId === userId || parent.isSystem;
      if (!ownedByUser) {
        throw ApiError.forbidden('You do not have access to that parent category');
      }
    }

    return categoryRepository.create(userId, input);
  }

  // ─── Update ────────────────────────────────────────────────────────────────

  async update(userId: string, categoryId: string, input: UpdateCategoryInput) {
    const category = await this.getOwnedCategory(userId, categoryId);

    if (category.isSystem) {
      throw ApiError.forbidden('System categories cannot be edited');
    }

    return categoryRepository.update(categoryId, input);
  }

  // ─── Delete ────────────────────────────────────────────────────────────────

  async delete(userId: string, categoryId: string) {
    const category = await this.getOwnedCategory(userId, categoryId);

    if (category.isSystem) {
      throw ApiError.forbidden('System categories cannot be deleted');
    }

    const hasExpenses = await categoryRepository.hasExpenses(categoryId);
    if (hasExpenses) {
      throw ApiError.conflict(
        'Cannot delete a category that has expenses linked to it. Reassign or delete those expenses first.'
      );
    }

    return categoryRepository.delete(categoryId);
  }

  // ─── Private Helpers ───────────────────────────────────────────────────────

  /**
   * Fetches a category and ensures it exists and belongs to this user.
   * System categories are included so we can explicitly block edits/deletes on them.
   */
  private async getOwnedCategory(userId: string, categoryId: string) {
    const category = await categoryRepository.findById(categoryId);

    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    // System categories are readable by all, but no one "owns" them
    if (!category.isSystem && category.userId !== userId) {
      throw ApiError.forbidden('You do not have access to this category');
    }

    return category;
  }
}

export const categoryService = new CategoryService();
