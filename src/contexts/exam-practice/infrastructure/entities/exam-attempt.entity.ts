import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { ExamAttemptStatus, ExamType } from '../../domain/enums/exam.enum';

@Entity('exam_attempts')
export class ExamAttemptEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  testId: string;

  @Column({ type: 'varchar', length: 50 })
  testType: ExamType;

  @Column({ type: 'varchar', length: 50 })
  status: ExamAttemptStatus;

  @Column({ type: 'int', default: 0 })
  listeningScore: number;

  @Column({ type: 'int', default: 0 })
  readingScore: number;

  @Column({ type: 'int', default: 0 })
  totalScore: number;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @Column({ type: 'jsonb', default: [] })
  answers: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean | null;
  }[];
}
