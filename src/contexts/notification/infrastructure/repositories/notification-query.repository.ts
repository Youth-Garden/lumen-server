import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  INotificationQueryRepository,
  NotificationResponseDto,
} from '../../application/ports/notification-query.repository';
import { NotificationEntity } from '../entities/notification.entity';

@Injectable()
export class NotificationQueryRepository implements INotificationQueryRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repo: Repository<NotificationEntity>,
  ) {}

  async findByUserId(userId: string): Promise<NotificationResponseDto[]> {
    const entities = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 20,
    });

    return entities.map((entity) => ({
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      description: entity.description,
      isRead: entity.isRead,
      createdAt: entity.createdAt,
    }));
  }
}
