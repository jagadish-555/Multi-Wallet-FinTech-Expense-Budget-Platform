import { notificationRepository } from '../repositories/notification.repository';
import { ApiError } from '../utils/ApiError';

export class NotificationService {
  async getAll(userId: string) {
    const notifications = await notificationRepository.findAllByUser(userId);
    const unreadCount = await notificationRepository.getUnreadCount(userId);
    return { notifications, unreadCount };
  }

  async markAsRead(userId: string, notificationId: string) {
    const result = await notificationRepository.markAsRead(notificationId, userId);
    if (result.count === 0) {
      throw ApiError.notFound('Notification not found');
    }
    return result;
  }

  async markAllAsRead(userId: string) {
    return notificationRepository.markAllAsRead(userId);
  }

  async delete(userId: string, notificationId: string) {
    const result = await notificationRepository.delete(notificationId, userId);
    if (result.count === 0) {
      throw ApiError.notFound('Notification not found');
    }
    return result;
  }
}

export const notificationService = new NotificationService();
