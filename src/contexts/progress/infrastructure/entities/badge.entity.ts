import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, PrimaryColumn } from 'typeorm';
import type { I18nString } from '../../../../shared/domain/types/translation.type';

@Entity('badges')
export class BadgeEntity extends BaseEntity {
  @PrimaryColumn('varchar', { length: 50 })
  code: string;

  @Column({ type: 'jsonb', default: {} })
  name: I18nString;

  @Column({ type: 'jsonb', default: {} })
  description: I18nString;

  @Column({ type: 'varchar', length: 50 })
  icon: string;
}
