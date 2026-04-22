import { categoryRepository } from '../repositories/category.repository';
import { ApiError } from '../utils/ApiError';
import { CreateCategoryInput, UpdateCategoryInput } from '../validators/category.validator';

export class CategoryService {
  async getAll(userId: string) {
    return categoryRepository.findAllByUser(userId);
  }

  async create(userId: string, input: CreateCategoryInput) {
    return categoryRepository.create(userId, input);
  }

  async update(userId: string, categoryId: string, input: UpdateCategoryInput) {
    const category = await this.getOwnedCategory(userId, categoryId);

    if (category.isSystem) {
      throw ApiError.forbidden('System categories cannot be edited');
    }

    return categoryRepository.update(categoryId, input);
  }

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

  private async getOwnedCategory(userId: string, categoryId: string) {
    const category = await categoryRepository.findById(categoryId);

    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    if (!category.isSystem && category.userId !== userId) {
      throw ApiError.forbidden('You do not have access to this category');
    }

    return category;
  }
}

export const categoryService = new CategoryService();
