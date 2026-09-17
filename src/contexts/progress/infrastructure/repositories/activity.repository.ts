import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../../shared/infrastructure/database/base.repository';
import { Activity } from '../../domain/entities/activity.entity';
import { IActivityRepository } from '../../domain/repositories/activity.repository.interface';
import { ActivityEntity } from '../entities/activity.entity';

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

  async findByUserId(
    userId: string,
    limit = 10,
    page = 1,
  ): Promise<Activity[]> {
    const offset = (page - 1) * limit;
    const entities = await this.repository.find({
      where: { userId },
      order: { timestamp: 'DESC' },
      skip: offset,
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
    endDate?: Date,
  ): Promise<{ date: string; count: number }[]> {
    const qb = this.repository
      .createQueryBuilder('activity')
      .select('DATE(activity.timestamp)', 'date')
      .addSelect('COUNT(activity.id)', 'count')
      .where('activity.userId = :userId', { userId })
      .andWhere('activity.timestamp >= :startDate', { startDate });

    if (endDate) {
      qb.andWhere('activity.timestamp <= :endDate', { endDate });
    }

    const raw = await qb
      .groupBy('DATE(activity.timestamp)')
      .orderBy('date', 'ASC')
      .getRawMany<{ date: string | Date; count: string | number }>();

    const resultMap = new Map<string, number>();

    raw.forEach((row) => {
      const dateStr =
        row.date instanceof Date
          ? row.date.toISOString().split('T')[0]
          : String(row.date);
      const count =
        typeof row.count === 'string'
          ? parseInt(row.count, 10)
          : Number(row.count);
      resultMap.set(dateStr, count);
    });

    try {
      const progressQuery = endDate
        ? `SELECT DATE(COALESCE("lastReviewedAt", "updatedAt", "createdAt")) as date, COUNT(id) as count
           FROM vocab_user_progress
           WHERE "userId" = $1 
             AND COALESCE("lastReviewedAt", "updatedAt", "createdAt") >= $2
             AND COALESCE("lastReviewedAt", "updatedAt", "createdAt") <= $3
           GROUP BY DATE(COALESCE("lastReviewedAt", "updatedAt", "createdAt"))`
        : `SELECT DATE(COALESCE("lastReviewedAt", "updatedAt", "createdAt")) as date, COUNT(id) as count
           FROM vocab_user_progress
           WHERE "userId" = $1 
             AND COALESCE("lastReviewedAt", "updatedAt", "createdAt") >= $2
           GROUP BY DATE(COALESCE("lastReviewedAt", "updatedAt", "createdAt"))`;

      const queryParams = endDate
        ? [userId, startDate, endDate]
        : [userId, startDate];

      const progressRaw: { date: string | Date; count: string | number }[] =
        await this.repository.query(progressQuery, queryParams);

      progressRaw.forEach((row) => {
        const dateStr =
          row.date instanceof Date
            ? row.date.toISOString().split('T')[0]
            : String(row.date);
        const count =
          typeof row.count === 'string'
            ? parseInt(row.count, 10)
            : Number(row.count);
        const existing = resultMap.get(dateStr) || 0;
        resultMap.set(dateStr, Math.max(existing, count));
      });
    } catch {
      // Fallback if raw query is not supported
    }

    return Array.from(resultMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((firstItem, secondItem) =>
        firstItem.date.localeCompare(secondItem.date),
      );
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
