import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { FolderEntity } from './folder.entity';
import { FlashcardEntity } from './flashcard.entity';
import type { I18nString } from '../../../../shared/domain/types/translation.type';

@Entity('vocab_topics')
@Index('idx_topics_folder_id', ['folderId'])
export class TopicEntity extends BaseEntity {
  @Column({ name: 'folderId', type: 'uuid' })
  folderId: string;

  @Column({ type: 'jsonb', default: {} })
  name: I18nString;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ type: 'int', default: 0 })
  orderIndex: number;

  @ManyToOne(() => FolderEntity, (folder) => folder.topics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'folderId' })
  folder: FolderEntity;

  @OneToMany(() => FlashcardEntity, (flashcard) => flashcard.topicEntity)
  flashcards: FlashcardEntity[];
}
