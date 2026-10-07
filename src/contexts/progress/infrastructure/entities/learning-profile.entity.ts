import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('learning_profiles')
@Index('idx_learning_profiles_leaderboard', ['totalPoints', 'streak'])
@Index('idx_learning_profiles_user_id', ['userId'], { unique: true })
export class LearningProfileEntity extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  userId: string;

  @Column({ type: 'int', default: 0 })
  streak: number;

  @Column({ type: 'timestamp', nullable: true })
  lastActivityDate: Date | null;

  @Column({ type: 'int', default: 0 })
  totalPoints: number;

  @Column({ type: 'int', default: 15 })
  dailyGoalMinutes: number;

  @Column({ type: 'simple-array', nullable: true })
  unlockedBadges: string[] | null;

  @Column({ type: 'int', default: 0 })
  streakFreezes: number;

  @Column({ type: 'simple-array', nullable: true })
  frozenDates: string[] | null;
}
