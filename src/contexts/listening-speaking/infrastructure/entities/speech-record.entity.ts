import { BaseEntity } from '../../../../shared-kernel/infrastructure/database/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('speech_records')
export class SpeechRecordEntity extends BaseEntity {
  @Column('uuid')
  userId: string;

  @Column('uuid')
  speakingTaskId: string;

  @Column({ type: 'varchar', length: 255 })
  audioUrl: string;

  @Column({ type: 'float' })
  accuracyScore: number;

  @Column({ type: 'text' })
  feedback: string;
}
