import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('speech_records')
export class SpeechRecordEntity {
  @PrimaryColumn('uuid')
  id: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
