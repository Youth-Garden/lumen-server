import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column } from 'typeorm';
import { TranscriptLine } from '../../domain/aggregates/listening-lesson.aggregate';

@Entity('listening_lessons')
export class ListeningLessonEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  audioUrl: string;

  @Column({ type: 'varchar', length: 10 })
  cefrLevel: string;

  @Column({ type: 'jsonb', default: '[]' })
  transcript: TranscriptLine[];
}
