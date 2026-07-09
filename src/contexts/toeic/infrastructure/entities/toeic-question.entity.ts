import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ToeicTestEntity } from './toeic-test.entity';

@Entity('toeic_questions')
export class ToeicQuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  testId: string;

  @Column('int')
  part: number; // 1 to 7

  @Column('int')
  questionNumber: number;

  @Column({ nullable: true })
  audioUrl: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column('text', { nullable: true })
  transcript: string;

  @Column('text', { nullable: true })
  questionText: string;

  @Column({ type: 'jsonb', nullable: true })
  options?: string[]; // typically 3 or 4 options

  @Column({ type: 'uuid', nullable: true })
  materialId?: string;

  @Column({ nullable: true })
  correctAnswer: string; // A, B, C, D

  @Column('text', { nullable: true })
  explanation: string;

  @ManyToOne(() => ToeicTestEntity, (test: ToeicTestEntity) => test.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'testId' })
  test: ToeicTestEntity;
}
