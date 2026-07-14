import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateNotificationCommand } from './create-notification.command';
import { NOTIFICATION_REPOSITORY } from '../../domain/repositories/notification.repository.interface';
import type { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { Notification } from '../../domain/aggregates/notification';

@CommandHandler(CreateNotificationCommand)
export class CreateNotificationHandler implements ICommandHandler<
  CreateNotificationCommand,
  void
> {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(command: CreateNotificationCommand): Promise<void> {
    const notification = Notification.create(
      command.userId,
      command.title,
      command.description,
    );
    await this.notificationRepository.save(notification);
  }
}
