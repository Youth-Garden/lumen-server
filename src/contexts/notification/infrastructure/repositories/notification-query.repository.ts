import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  INotificationQueryRepository,
  NotificationResponseDto,
} from '../../application/ports/notification-query.repository';
import { NotificationEntity } from '../entities/notification.entity';

@Injectable()
export class NotificationQueryRepository
  extends BaseRepository<NotificationEntity>
  implements INotificationQueryRepository
{
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repo: Repository<NotificationEntity>,
  ) {
    super(repo);
  }

  async findByUserId(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<NotificationResponseDto[]> {
    const offset = (page - 1) * limit;
    const entities = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
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
