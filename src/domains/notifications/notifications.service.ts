import { Injectable } from '@nestjs/common';
import { NotificationOperations } from './operations';
import { CreateNotificationInput, UpdateNotificationInput } from './inputs';

@Injectable()
export class NotificationsService {
  constructor(private notificationOperations: NotificationOperations) {}

  async createNotification(input: CreateNotificationInput) {
    return this.notificationOperations.createNotification(input);
  }

  async updateNotification(id: string, input: UpdateNotificationInput) {
    return this.notificationOperations.updateNotification(id, input);
  }

  async getUserNotifications(userId: string) {
    return this.notificationOperations.getUserNotifications(userId);
  }

  async markAllAsRead(userId: string) {
    return this.notificationOperations.markAllAsRead(userId);
  }

  async getUnreadCount(userId: string) {
    return this.notificationOperations.getUnreadCount(userId);
  }

  async deleteNotification(id: string) {
    return this.notificationOperations.deleteNotification(id);
  }
}
