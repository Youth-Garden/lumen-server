import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('daily_goal_histories')
@Index('idx_daily_goal_histories_user_effective', ['userId', 'effectiveFrom'])
export class DailyGoalHistoryEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'int' })
  targetMinutes: number;

  @Column({ type: 'timestamp' })
  effectiveFrom: Date;

  @Column({ type: 'timestamp', nullable: true })
  effectiveTo: Date | null;
}
