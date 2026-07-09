import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { DeckEntity } from './deck.entity';
import { WordEntity } from './word.entity';
import { UserProgressEntity } from './user-progress.entity';

@Entity('vocab_flashcards')
export class FlashcardEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  deckId: string;

  @Column({ type: 'uuid' })
  wordId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => DeckEntity, (deck) => deck.flashcards, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'deckId' })
  deck: DeckEntity;

  @ManyToOne(() => WordEntity, (word) => word.flashcards, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wordId' })
  word: WordEntity;

  @OneToMany(() => UserProgressEntity, (progress) => progress.flashcard)
  progresses: UserProgressEntity[];
}
