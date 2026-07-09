import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('speaking_tasks')
export class SpeakingTaskEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  prompt: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referenceAudioUrl: string | null;

  @Column('simple-array')
  keywords: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
