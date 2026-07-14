import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { UserNoteCategory } from '../../domain/entities/user-note';

@Entity('toeic_user_notes')
@Index(['userId', 'questionId'], { unique: true })
export class UserNoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  questionId: string;

  @Column('uuid')
  testId: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: UserNoteCategory,
    default: UserNoteCategory.REMINDER,
  })
  category: UserNoteCategory;

  @Column({ type: 'jsonb', default: [] })
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
