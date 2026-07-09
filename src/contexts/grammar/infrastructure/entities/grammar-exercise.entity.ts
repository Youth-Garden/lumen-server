import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GrammarLessonEntity } from './grammar-lesson.entity';

@Entity('grammar_exercises')
export class GrammarExerciseEntity {
  @PrimaryColumn('uuid')
  id: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
