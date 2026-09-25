import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, OneToMany, Index } from 'typeorm';
import { FlashcardEntity } from './flashcard.entity';
import type { I18nString } from '../../../../shared/domain/types/translation.type';

@Entity('vocab_folders')
@Index('idx_folders_author_id', ['authorId'])
export class FolderEntity extends BaseEntity {
  @Column({ type: 'jsonb', default: {} })
  name: I18nString;

  @Column({ type: 'jsonb', nullable: true })
  description: I18nString | null;

  @Column({ type: 'uuid', nullable: false })
  authorId: string;

  @Column({ type: 'jsonb', nullable: true })
  category: I18nString | null;

  @Column({ type: 'boolean', default: false })
  isSystem: boolean;

  @Column({ type: 'text', nullable: true })
  imageUrl: string | null;

  @OneToMany(() => FlashcardEntity, (flashcard) => flashcard.folder)
  flashcards: FlashcardEntity[];
}
