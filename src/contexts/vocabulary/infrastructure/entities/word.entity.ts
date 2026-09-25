import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, OneToMany, Index } from 'typeorm';
import { DefinitionEntity } from './definition.entity';
import { FlashcardEntity } from './flashcard.entity';
import type { I18nString } from '../../../../shared/domain/types/translation.type';

@Entity('vocab_words')
@Index('idx_words_cefr', ['cefrLevel'])
export class WordEntity extends BaseEntity {
  @Column({ unique: true })
  term: string;

  @Column({ type: 'jsonb', nullable: true })
  topic: I18nString | null;

  @Column({ type: 'varchar', nullable: true })
  topicImageUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  phonetic: string | null;

  @Column({ type: 'varchar', nullable: true })
  phoneticUs: string | null;

  @Column({ type: 'varchar', nullable: true })
  phoneticUk: string | null;

  @Column({ type: 'varchar', nullable: true })
  audioUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  audioUsUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  audioUkUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  cefrLevel: string | null;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @OneToMany(() => DefinitionEntity, (definition) => definition.word)
  definitions: DefinitionEntity[];

  @OneToMany(() => FlashcardEntity, (flashcard) => flashcard.word)
  flashcards: FlashcardEntity[];
}
