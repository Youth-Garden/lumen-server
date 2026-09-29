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
import { TopicEntity } from './topic.entity';
import { UserProgressEntity } from './user-progress.entity';
import type { I18nString } from '../../../../shared/domain/types/translation.type';

@Entity('vocab_flashcards')
@Index('idx_flashcards_folder_id', ['folderId'])
@Index('idx_flashcards_word_id', ['wordId'])
@Index('idx_flashcards_topic_id', ['topicId'])
@Index('idx_flashcards_folder_word', ['folderId', 'wordId'], { unique: true })
export class FlashcardEntity extends BaseEntity {
  @Column({ name: 'folderId', type: 'uuid' })
  folderId: string;

  @Column({ type: 'uuid' })
  wordId: string;

  @Column({ name: 'topicId', type: 'uuid', nullable: true })
  topicId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  topic: I18nString | null;

  @Column({ type: 'varchar', nullable: true })
  topicImageUrl: string | null;

  @ManyToOne(() => TopicEntity, (t) => t.flashcards, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'topicId' })
  topicEntity: TopicEntity | null;

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
