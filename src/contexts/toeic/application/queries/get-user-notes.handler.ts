import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNoteEntity } from '../../infrastructure/entities/user-note.entity';

export class GetUserNotesQuery {
  constructor(
    public readonly userId: string,
    public readonly testId?: string,
  ) {}
}

@QueryHandler(GetUserNotesQuery)
export class GetUserNotesHandler implements IQueryHandler<
  GetUserNotesQuery,
  UserNoteEntity[]
> {
  constructor(
    @InjectRepository(UserNoteEntity)
    private readonly noteRepo: Repository<UserNoteEntity>,
  ) {}

  async execute(query: GetUserNotesQuery): Promise<UserNoteEntity[]> {
    const where: Record<string, string> = { userId: query.userId };
    if (query.testId) {
      where.testId = query.testId;
    }
    return this.noteRepo.find({
      where,
      order: { updatedAt: 'DESC' },
    });
  }
}
