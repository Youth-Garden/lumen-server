import { NotificationResponseDto } from '../responses/notification.response.dto';

export { NotificationResponseDto };

export const NOTIFICATION_QUERY_REPOSITORY = Symbol(
  'NOTIFICATION_QUERY_REPOSITORY',
);

export interface INotificationQueryRepository {
  findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<NotificationResponseDto[]>;
}
