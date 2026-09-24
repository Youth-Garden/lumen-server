import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, OneToMany, Index } from 'typeorm';
import { FlashcardEntity } from './flashcard.entity';

@Entity('vocab_folders')
@Index('idx_folders_author_id', ['authorId'])
export class FolderEntity extends BaseEntity {
  @Column({ type: 'jsonb', default: {} })
  name: Record<string, string> | string;

  @Column({ type: 'jsonb', nullable: true })
  description: Record<string, string> | string | null;

  @Column({ type: 'uuid', nullable: false })
  authorId: string;

  @Column({ type: 'jsonb', nullable: true })
  category: Record<string, string> | string | null;

  @Column({ type: 'boolean', default: false })
  isSystem: boolean;

  @Column({ type: 'text', nullable: true })
  imageUrl: string | null;

  @OneToMany(() => FlashcardEntity, (flashcard) => flashcard.folder)
  flashcards: FlashcardEntity[];
}
