import { BaseEntity } from '../../../../shared-kernel/infrastructure/database/base.entity';
import { Entity, Column, CreateDateColumn } from 'typeorm';
import { ActivityType } from '../../domain/enums/material.enum';

@Entity('activity_logs')
export class ActivityLogEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  materialId: string;

  @Column({ type: 'enum', enum: ActivityType })
  activityType: ActivityType;

  @Column({
    type: 'float',
    nullable: true,
    comment: 'Score or accuracy percentage',
  })
  score?: number;

  @CreateDateColumn()
  completedAt: Date;
}
