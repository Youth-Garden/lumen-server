import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TranscriptLine } from '../../domain/aggregates/listening-lesson.aggregate';

@Entity('listening_lessons')
export class ListeningLessonEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  audioUrl: string;

  @Column({ type: 'varchar', length: 10 })
  cefrLevel: string;

  @Column({ type: 'jsonb' })
  transcript: TranscriptLine[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
