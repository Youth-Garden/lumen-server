import { Activity } from '../entities/activity.entity';

export const ACTIVITY_REPOSITORY = 'ACTIVITY_REPOSITORY';

export interface IActivityRepository {
  findByUserId(userId: string, limit: number): Promise<Activity[]>;
  save(activity: Activity): Promise<void>;
}
