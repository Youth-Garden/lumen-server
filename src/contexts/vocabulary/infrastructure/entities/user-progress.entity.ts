import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FlashcardEntity } from './flashcard.entity';

@Entity('vocab_user_progress')
export class UserProgressEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  flashcardId: string;

  @Column({ type: 'int', default: 0 })
  srsLevel: number;

  @Column({ type: 'float', default: 2.5 })
  easeFactor: number;

  @Column({ type: 'int', default: 0 })
  interval: number;

  @Column({ type: 'int', default: 0 })
  repetitions: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  nextReviewDate: Date;

  @ManyToOne(() => FlashcardEntity, (flashcard) => flashcard.progresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'flashcardId' })
  flashcard: FlashcardEntity;
}
