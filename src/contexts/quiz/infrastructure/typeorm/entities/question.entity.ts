import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuizEntity } from './quiz.entity';

@Entity('quiz_questions')
export class QuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ nullable: true })
  userAnswer: string | null;

  @Column({ nullable: true })
  isCorrect: boolean | null;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quizId' })
  quiz: QuizEntity;
}
