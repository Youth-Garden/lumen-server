export const NOTIFICATION_QUERY_REPOSITORY = Symbol('NOTIFICATION_QUERY_REPOSITORY');

export class NotificationResponseDto {
  id: string;
  userId: string;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: Date;
}

export interface INotificationQueryRepository {
  findByUserId(userId: string): Promise<NotificationResponseDto[]>;
}
