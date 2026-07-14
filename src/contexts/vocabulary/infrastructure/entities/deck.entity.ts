import { BaseEntity } from '../../../../shared-kernel/infrastructure/database/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { FlashcardEntity } from './flashcard.entity';

@Entity('vocab_decks')
export class DeckEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ type: 'uuid', nullable: false })
  authorId: string;

  @OneToMany(() => FlashcardEntity, (flashcard) => flashcard.deck)
  flashcards: FlashcardEntity[];
}
