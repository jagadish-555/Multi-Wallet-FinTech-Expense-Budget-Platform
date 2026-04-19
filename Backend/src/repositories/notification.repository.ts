import prisma from '../config/database';
import { NotificationType } from '@prisma/client';

export class NotificationRepository {
  async findAllByUser(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async create(data: {
    userId: string;
    type: NotificationType;
    message: string;
    budgetId?: string | null;
  }) {
    return prisma.notification.create({ data });
  }

  async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async delete(id: string, userId: string) {
    return prisma.notification.deleteMany({ where: { id, userId } });
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  }

  async existsForBudgetAndType(userId: string, budgetId: string, type: NotificationType): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await prisma.notification.count({
      where: {
        userId,
        budgetId,
        type,
        createdAt: { gte: today },
      },
    });

    return count > 0;
  }
}

export const notificationRepository = new NotificationRepository();
