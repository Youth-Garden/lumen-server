import { BaseEntity } from '../../../../shared-kernel/infrastructure/database/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GrammarLessonEntity } from './grammar-lesson.entity';

@Entity('grammar_exercises')
export class GrammarExerciseEntity extends BaseEntity {
  @Column('uuid')
  lessonId: string;

  @Column({ type: 'text' })
  questionText: string;

  @Column('simple-array')
  options: string[];

  @Column({ type: 'varchar', length: 255 })
  correctAnswer: string;

  @Column({ type: 'text' })
  explanation: string;

  @ManyToOne(() => GrammarLessonEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lessonId' })
  lesson: GrammarLessonEntity;
}
