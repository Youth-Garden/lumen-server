import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { FolderEntity } from './folder.entity';
import { WordEntity } from './word.entity';
import { UserProgressEntity } from './user-progress.entity';

@Entity('vocab_flashcards')
@Index('idx_flashcards_folder_id', ['folderId'])
@Index('idx_flashcards_word_id', ['wordId'])
@Index('idx_flashcards_folder_word', ['folderId', 'wordId'], { unique: true })
@Index('idx_flashcards_folder_topic', ['folderId', 'topic'])
export class FlashcardEntity extends BaseEntity {
  @Column({ name: 'folderId', type: 'uuid' })
  folderId: string;

  @Column({ type: 'uuid' })
  wordId: string;

  @Column({ type: 'varchar', nullable: true })
  topic: string | null;

  @Column({ type: 'varchar', nullable: true })
  topicVi: string | null;

  @Column({ type: 'varchar', nullable: true })
  topicImageUrl: string | null;

  @ManyToOne(() => FolderEntity, (folder) => folder.flashcards, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'folderId' })
  folder: FolderEntity;

  @ManyToOne(() => WordEntity, (word) => word.flashcards, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wordId' })
  word: WordEntity;

  @OneToMany(() => UserProgressEntity, (progress) => progress.flashcard)
  progresses: UserProgressEntity[];
}
