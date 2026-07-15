import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FlashcardEntity } from './flashcard.entity';

@Entity('vocab_user_progress')
export class UserProgressEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  flashcardId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  due: Date;

  @Column({ type: 'float', default: 0 })
  stability: number;

  @Column({ type: 'float', default: 0 })
  difficulty: number;

  @Column({ type: 'int', default: 0 })
  elapsed_days: number;

  @Column({ type: 'int', default: 0 })
  scheduled_days: number;

  @Column({ type: 'int', default: 0 })
  learning_steps: number;

  @Column({ type: 'int', default: 0 })
  reps: number;

  @Column({ type: 'int', default: 0 })
  lapses: number;

  @Column({ type: 'int', default: 0 })
  state: number;

  @Column({ type: 'timestamp', nullable: true })
  last_review: Date | null;

  @ManyToOne(() => FlashcardEntity, (flashcard) => flashcard.progresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'flashcardId' })
  flashcard: FlashcardEntity;
}
