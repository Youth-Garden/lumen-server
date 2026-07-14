import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetNotificationsQuery } from './get-notifications.query';
import { NOTIFICATION_QUERY_REPOSITORY } from '../ports/notification-query.repository';
import type {
  INotificationQueryRepository,
  NotificationResponseDto,
} from '../ports/notification-query.repository';

@QueryHandler(GetNotificationsQuery)
export class GetNotificationsHandler implements IQueryHandler<
  GetNotificationsQuery,
  NotificationResponseDto[]
> {
  constructor(
    @Inject(NOTIFICATION_QUERY_REPOSITORY)
    private readonly notificationQueryRepository: INotificationQueryRepository,
  ) {}

  async execute(
    query: GetNotificationsQuery,
  ): Promise<NotificationResponseDto[]> {
    return this.notificationQueryRepository.findByUserId(query.userId);
  }
}
