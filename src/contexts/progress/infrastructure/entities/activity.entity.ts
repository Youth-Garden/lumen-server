import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, CreateDateColumn } from 'typeorm';

@Entity('activities')
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
