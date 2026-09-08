import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FlashcardEntity } from './flashcard.entity';

@Entity('vocab_user_progress')
export class UserProgressEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  flashcardId: string;

  @Column({ type: 'float', default: 0 })
  masteryScore: number;

  @Column({ type: 'int', default: 0 })
  level: number;

  @Column({ type: 'boolean', default: false })
  isWilted: boolean;

  @Column({ type: 'int', default: 0 })
  learningStep: number;

  @Column({ type: 'int', default: 0 })
  reviewCountAtCurrentLevel: number;

  @Column({ type: 'float', default: 0 })
  intervalDays: number;

  @Column({ type: 'timestamp', nullable: true })
  nextReviewAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  lastReviewedAt: Date | null;

  @ManyToOne(() => FlashcardEntity, (flashcard) => flashcard.progresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'flashcardId' })
  flashcard: FlashcardEntity;
}
