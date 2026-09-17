import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, Index } from 'typeorm';

@Entity('notifications')
@Index('idx_notifications_user_created', ['userId', 'createdAt'])
export class NotificationEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;
}
