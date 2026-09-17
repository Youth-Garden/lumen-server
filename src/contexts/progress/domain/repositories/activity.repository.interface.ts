import { Activity } from '../entities/activity.entity';

export const ACTIVITY_REPOSITORY = 'ACTIVITY_REPOSITORY';

export interface IActivityRepository {
  findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<Activity[]>;
  findTodayActivities(userId: string): Promise<Activity[]>;
  getHeatmapData(
    userId: string,
    startDate: Date,
    endDate?: Date,
  ): Promise<{ date: string; count: number }[]>;
  save(activity: Activity): Promise<void>;
}
