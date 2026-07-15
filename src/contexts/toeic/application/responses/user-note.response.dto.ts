import { Expose } from 'class-transformer';
import { UserNoteCategory } from '../../domain/entities/user-note';

export class UserNoteResponseDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  questionId: string;

  @Expose()
  testId: string;

  @Expose()
  content: string;

  @Expose()
  quote?: string;

  @Expose()
  category: UserNoteCategory;

  @Expose()
  tags: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<UserNoteResponseDto>) {
    Object.assign(this, partial);
  }
}
