import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { MarkNotificationReadCommand } from './mark-notification-read.command';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories/notification.repository.interface';
import type { INotificationRepository } from '../../domain/repositories/notification.repository.interface';

@CommandHandler(MarkNotificationReadCommand)
export class MarkNotificationReadHandler implements ICommandHandler<
  MarkNotificationReadCommand,
  void
> {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(command: MarkNotificationReadCommand): Promise<void> {
    const notification = await this.notificationRepository.findById(
      command.notificationId,
    );
    if (!notification || notification.userId !== command.userId) return;

    notification.markAsRead();
    await this.notificationRepository.save(notification);
  }
}
