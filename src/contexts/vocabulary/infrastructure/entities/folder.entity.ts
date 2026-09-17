import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, OneToMany, Index } from 'typeorm';
import { FlashcardEntity } from './flashcard.entity';

@Entity('vocab_folders')
@Index('idx_folders_author_id', ['authorId'])
@Index('idx_folders_category', ['category'])
export class FolderEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ type: 'uuid', nullable: false })
  authorId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string | null;

  @OneToMany(() => FlashcardEntity, (flashcard) => flashcard.folder)
  flashcards: FlashcardEntity[];
}
