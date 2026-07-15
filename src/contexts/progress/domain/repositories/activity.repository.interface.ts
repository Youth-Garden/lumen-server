import { Activity } from '../entities/activity.entity';

export const ACTIVITY_REPOSITORY = 'ACTIVITY_REPOSITORY';

export interface IActivityRepository {
  findByUserId(userId: string, limit: number): Promise<Activity[]>;
  findTodayActivities(userId: string): Promise<Activity[]>;
  getHeatmapData(
    userId: string,
    startDate: Date,
  ): Promise<{ date: string; count: number }[]>;
  save(activity: Activity): Promise<void>;
}
