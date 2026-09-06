import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { FolderEntity } from './folder.entity';
import { WordEntity } from './word.entity';
import { UserProgressEntity } from './user-progress.entity';

@Entity('vocab_flashcards')
export class FlashcardEntity extends BaseEntity {
  @Column({ name: 'folderId', type: 'uuid' })
  folderId: string;

  @Column({ type: 'uuid' })
  wordId: string;

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
