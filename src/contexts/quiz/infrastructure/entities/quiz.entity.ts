import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { QuestionEntity } from './question.entity';

@Entity('quizzes')
export class QuizEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  status: string;

  @Column({ type: 'float', default: 0 })
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @OneToMany(
    () => QuestionEntity,
    (question: QuestionEntity) => question.quiz,
    {
      cascade: true,
    },
  )
  questions: QuestionEntity[];
}
