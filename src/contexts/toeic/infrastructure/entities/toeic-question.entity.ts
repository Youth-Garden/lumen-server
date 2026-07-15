import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import type { TranslationRecord } from '../../../../shared/domain/types/translation.type';
import { ToeicTestEntity } from './toeic-test.entity';
import { ToeicQuestionTopic } from '../../domain/enums/toeic-question-topic.enum';

@Entity('toeic_questions')
export class ToeicQuestionEntity extends BaseEntity {
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

  @Column({ type: 'jsonb', nullable: true })
  @Index('idx_toeic_question_explanation_jsonb')
  explanation?: TranslationRecord;

  @Column({
    type: 'enum',
    enum: ToeicQuestionTopic,
    nullable: true,
  })
  topic?: ToeicQuestionTopic;

  @Column({ type: 'jsonb', nullable: true })
  mediaUrls?: string[];

  @ManyToOne(() => ToeicTestEntity, (test: ToeicTestEntity) => test.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'testId' })
  test: ToeicTestEntity;
}
