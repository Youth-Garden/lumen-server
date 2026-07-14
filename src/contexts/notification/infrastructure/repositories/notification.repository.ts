import { BaseRepository } from '../../../../shared-kernel/infrastructure/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { Notification } from '../../domain/aggregates/notification';
import { NotificationEntity } from '../entities/notification.entity';

@Injectable()
export class NotificationRepository
  extends BaseRepository<NotificationEntity>
  implements INotificationRepository
{
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repo: Repository<NotificationEntity>,
  ) {
    super(repo);
  }

  async save(notification: Notification): Promise<void> {
    const entity = this.toPersistence(notification);
    await this.repo.save(entity);
  }

  async findById(id: string): Promise<Notification | null> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const entities = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.repo.update({ userId, isRead: false }, { isRead: true });
  }

  private toDomain(entity: NotificationEntity): Notification {
    return Notification.restore(
      entity.id,
      entity.userId,
      entity.title,
      entity.description,
      entity.isRead,
      entity.createdAt,
    );
  }

  private toPersistence(notification: Notification): NotificationEntity {
    const entity = new NotificationEntity();
    entity.id = notification.id;
    entity.userId = notification.userId;
    entity.title = notification.title;
    entity.description = notification.description;
    entity.isRead = notification.isRead;
    return entity;
  }
}
