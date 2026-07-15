import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('badges')
export class BadgeEntity extends BaseEntity {
  @PrimaryColumn('varchar', { length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  icon: string;
}
