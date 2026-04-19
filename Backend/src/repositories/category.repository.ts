import prisma from '../config/database';
import { CreateCategoryInput, UpdateCategoryInput } from '../validators/category.validator';

export class CategoryRepository {
  async findAllByUser(userId: string) {
    return prisma.category.findMany({
      where: {
        OR: [{ userId }, { isSystem: true }],
      },
      include: { children: true },
      orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
    });
  }

  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });
  }

  async create(userId: string, data: CreateCategoryInput) {
    return prisma.category.create({
      data: {
        userId,
        name: data.name,
        icon: data.icon,
        colorHex: data.colorHex,
        ...(data.parentId ? { parentId: data.parentId } : {}),
        isSystem: false,
      },
    });
  }

  async update(id: string, data: UpdateCategoryInput) {
    return prisma.category.update({
      where: { id },
      data: {
        ...(data.name      !== undefined && { name: data.name }),
        ...(data.icon      !== undefined && { icon: data.icon }),
        ...(data.colorHex  !== undefined && { colorHex: data.colorHex }),
        ...(data.parentId  !== undefined && { parentId: data.parentId }),
      },
    });
  }

  async delete(id: string) {
    return prisma.category.delete({ where: { id } });
  }

  async hasExpenses(id: string): Promise<boolean> {
    const count = await prisma.expense.count({
      where: { categoryId: id },
    });
    return count > 0;
  }
}

export const categoryRepository = new CategoryRepository();
