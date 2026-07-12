import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { MarkAllNotificationsReadCommand } from './mark-all-notifications-read.command';
import {
  NOTIFICATION_REPOSITORY,
} from '../../domain/repositories/notification.repository.interface';
import type { INotificationRepository } from '../../domain/repositories/notification.repository.interface';

@CommandHandler(MarkAllNotificationsReadCommand)
export class MarkAllNotificationsReadHandler
  implements ICommandHandler<MarkAllNotificationsReadCommand, void>
{
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(command: MarkAllNotificationsReadCommand): Promise<void> {
    await this.notificationRepository.markAllAsRead(command.userId);
  }
}
