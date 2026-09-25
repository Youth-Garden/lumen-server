import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, Index } from 'typeorm';

@Entity('vocab_seed_versions')
@Index('idx_seed_versions_version', ['version'])
export class SeedVersionEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  version: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'int', default: 0 })
  folderCount: number;

  @Column({ type: 'int', default: 0 })
  wordCount: number;

  @Column({ type: 'int', default: 0 })
  flashcardCount: number;

  @Column({ type: 'varchar', length: 50, default: 'COMPLETED' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;
}
