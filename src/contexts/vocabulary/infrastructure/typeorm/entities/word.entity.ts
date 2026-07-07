import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { DefinitionEntity } from './definition.entity';
import { FlashcardEntity } from './flashcard.entity';

@Entity('vocab_words')
export class WordEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  term: string;

  @Column({ nullable: true })
  phonetic: string | null;

  @Column({ nullable: true })
  audioUrl: string | null;

  @Column({ nullable: true })
  cefrLevel: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => DefinitionEntity, (definition) => definition.word)
  definitions: DefinitionEntity[];

  @OneToMany(() => FlashcardEntity, (flashcard) => flashcard.word)
  flashcards: FlashcardEntity[];
}
