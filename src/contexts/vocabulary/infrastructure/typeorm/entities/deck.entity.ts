import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { FlashcardEntity } from './flashcard.entity';

@Entity('vocab_decks')
export class DeckEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string | null;

  @Column({ type: 'uuid', nullable: true })
  authorId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FlashcardEntity, (flashcard) => flashcard.deck)
  flashcards: FlashcardEntity[];
}
