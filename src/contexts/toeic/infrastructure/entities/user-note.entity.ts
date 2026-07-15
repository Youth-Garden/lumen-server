import { BaseEntity } from '../../../../shared/infrastructure/database/base.entity';
import { Entity, Column, Index } from 'typeorm';
import { UserNoteCategory } from '../../domain/entities/user-note';

@Entity('toeic_user_notes')
@Index(['userId', 'questionId'], { unique: true })
export class UserNoteEntity extends BaseEntity {
  @Column('uuid')
  userId: string;

  @Column('uuid')
  questionId: string;

  @Column('uuid')
  testId: string;

  @Column('text')
  content: string;

  @Column({ type: 'text', nullable: true })
  quote?: string;

  @Column({
    type: 'enum',
    enum: UserNoteCategory,
    default: UserNoteCategory.REMINDER,
  })
  category: UserNoteCategory;

  @Column({ type: 'jsonb', default: [] })
  tags: string[];
}
