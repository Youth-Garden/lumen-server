import { BaseEntity } from '../../../../shared-kernel/infrastructure/database/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('speaking_tasks')
export class SpeakingTaskEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  prompt: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referenceAudioUrl: string | null;

  @Column('simple-array')
  keywords: string[];
}
