import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { QuizEntity } from './quiz.entity';

@Entity('quiz_questions')
export class QuestionEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  quizId: string;

  @Column({ type: 'uuid' })
  wordId: string;

  @Column()
  type: string;

  @Column()
  questionText: string;

  @Column('simple-json')
  options: string[];

  @Column()
  correctAnswer: string;

  @Column({ type: 'varchar', nullable: true })
  userAnswer: string | null;

  @Column({ type: 'boolean', nullable: true })
  isCorrect: boolean | null;

  @ManyToOne(() => QuizEntity, (quiz: QuizEntity) => quiz.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quizId' })
  quiz: QuizEntity;
}
