import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('activities')
@Index('idx_activities_user_timestamp', ['userId', 'timestamp'])
export class ActivityEntity extends BaseEntity {
  @Column('uuid')
  userId: string;

  @Column('varchar')
  type: string;

  @Column('varchar')
  title: string;

  @Column('text')
  description: string;

  @Column('int')
  xpEarned: number;

  @Column('int', { default: 0 })
  durationMinutes: number;

  @CreateDateColumn()
  timestamp: Date;
}
