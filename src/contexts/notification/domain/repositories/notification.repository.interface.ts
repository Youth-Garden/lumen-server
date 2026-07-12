export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');

export interface INotificationRepository {
  save(notification: import('../../domain/aggregates/notification').Notification): Promise<void>;
  findById(id: string): Promise<import('../../domain/aggregates/notification').Notification | null>;
  findByUserId(userId: string): Promise<import('../../domain/aggregates/notification').Notification[]>;
  markAllAsRead(userId: string): Promise<void>;
}
