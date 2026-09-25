import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, Index } from 'typeorm';
import type { I18nString } from '../../../../shared/domain/types/translation.type';

@Entity('notifications')
@Index('idx_notifications_user_created', ['userId', 'createdAt'])
export class NotificationEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'jsonb', default: {} })
  title: I18nString;

  @Column({ type: 'jsonb', default: {} })
  description: I18nString;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;
}
