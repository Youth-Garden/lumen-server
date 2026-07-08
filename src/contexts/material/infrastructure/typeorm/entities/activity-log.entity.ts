import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum ActivityType {
  DICTATION = 'DICTATION',
  READING = 'READING',
}

@Entity('activity_logs')
export class ActivityLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
