import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('learning_profiles')
export class LearningProfileEntity {
  @PrimaryColumn('uuid')
  userId: string;

  @Column({ type: 'int', default: 0 })
  streak: number;

  @Column({ type: 'timestamp', nullable: true })
  lastActivityDate: Date | null;

  @Column({ type: 'int', default: 0 })
  totalPoints: number;

  @Column({ type: 'int', default: 15 })
  dailyGoalMinutes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
