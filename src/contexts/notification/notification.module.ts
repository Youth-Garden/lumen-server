import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationEntity } from './infrastructure/entities/notification.entity';
import { NotificationController } from './presentation/http/notification.controller';
import { GetNotificationsHandler } from './application/queries/get-notifications.handler';
import { MarkNotificationReadHandler } from './application/commands/mark-notification-read.handler';
import { MarkAllNotificationsReadHandler } from './application/commands/mark-all-notifications-read.handler';
import { CreateNotificationHandler } from './application/commands/create-notification.handler';
import { NOTIFICATION_REPOSITORY } from './domain/repositories/notification.repository.interface';
import { NOTIFICATION_QUERY_REPOSITORY } from './application/ports/notification-query.repository';
import { NotificationRepository } from './infrastructure/repositories/notification.repository';
import { NotificationQueryRepository } from './infrastructure/repositories/notification-query.repository';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([NotificationEntity]),
  ],
  controllers: [NotificationController],
  providers: [
    GetNotificationsHandler,
    MarkNotificationReadHandler,
    MarkAllNotificationsReadHandler,
    CreateNotificationHandler,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: NotificationRepository,
    },
    {
      provide: NOTIFICATION_QUERY_REPOSITORY,
      useClass: NotificationQueryRepository,
    },
  ],
})
export class NotificationModule {}
