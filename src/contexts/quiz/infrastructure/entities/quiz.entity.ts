import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { QuestionEntity } from './question.entity';

@Entity('quizzes')
export class QuizEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  status: string;

  @Column({ type: 'float', default: 0 })
  score: number;

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
