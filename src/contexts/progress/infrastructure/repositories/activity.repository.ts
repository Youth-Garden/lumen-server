import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityEntity } from '../entities/activity.entity';
import { IActivityRepository } from '../../domain/repositories/activity.repository.interface';
import { Activity } from '../../domain/entities/activity.entity';

@Injectable()
export class ActivityRepository
  extends BaseRepository<ActivityEntity>
  implements IActivityRepository
{
  constructor(
    @InjectRepository(ActivityEntity)
    protected readonly repository: Repository<ActivityEntity>,
  ) {
    super(repository);
  }

  async findByUserId(userId: string, limit: number): Promise<Activity[]> {
    const entities = await this.repository.find({
      where: { userId },
      order: { timestamp: 'DESC' },
      take: limit,
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async findTodayActivities(userId: string): Promise<Activity[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entities = await this.repository
      .createQueryBuilder('activity')
      .where('activity.userId = :userId', { userId })
      .andWhere('activity.timestamp >= :today', { today })
      .orderBy('activity.timestamp', 'DESC')
      .getMany();

    return entities.map((entity) => this.toDomain(entity));
  }

  async getHeatmapData(
    userId: string,
    startDate: Date,
  ): Promise<{ date: string; count: number }[]> {
    const raw = await this.repository
      .createQueryBuilder('activity')
      .select('DATE(activity.timestamp)', 'date')
      .addSelect('COUNT(activity.id)', 'count')
      .where('activity.userId = :userId', { userId })
      .andWhere('activity.timestamp >= :startDate', { startDate })
      .groupBy('DATE(activity.timestamp)')
      .orderBy('date', 'ASC')
      .getRawMany<{ date: string | Date; count: string | number }>();

    return raw.map((row) => {
      const dateStr =
        row.date instanceof Date
          ? row.date.toISOString().split('T')[0]
          : String(row.date);
      return {
        date: dateStr,
        count:
          typeof row.count === 'string'
            ? parseInt(row.count, 10)
            : Number(row.count),
      };
    });
  }

  async save(activity: Activity): Promise<void> {
    const entity = this.toPersistence(activity);
    await this.repository.save(entity);
  }

  private toDomain(entity: ActivityEntity): Activity {
    return Activity.restore(
      entity.id,
      entity.userId,
      entity.type,
      entity.title,
      entity.description,
      entity.xpEarned,
      entity.durationMinutes,
      entity.timestamp,
    );
  }

  private toPersistence(domain: Activity): ActivityEntity {
    const entity = new ActivityEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.type = domain.type;
    entity.title = domain.title;
    entity.description = domain.description;
    entity.xpEarned = domain.xpEarned;
    entity.durationMinutes = domain.durationMinutes;
    entity.timestamp = domain.timestamp;
    return entity;
  }
}
