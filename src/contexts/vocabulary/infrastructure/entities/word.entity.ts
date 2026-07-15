import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { DefinitionEntity } from './definition.entity';
import { FlashcardEntity } from './flashcard.entity';

@Entity('vocab_words')
export class WordEntity extends BaseEntity {
  @Column({ unique: true })
  term: string;

  @Column({ type: 'varchar', nullable: true })
  phonetic: string | null;

  @Column({ type: 'varchar', nullable: true })
  audioUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  cefrLevel: string | null;

  @OneToMany(() => DefinitionEntity, (definition) => definition.word)
  definitions: DefinitionEntity[];

  @OneToMany(() => FlashcardEntity, (flashcard) => flashcard.word)
  flashcards: FlashcardEntity[];
}
