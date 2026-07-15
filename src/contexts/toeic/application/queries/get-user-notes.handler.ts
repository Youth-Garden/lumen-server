import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNoteEntity } from '../../infrastructure/entities/user-note.entity';
import { UserNoteResponseDto } from '../responses/user-note.response.dto';

export class GetUserNotesQuery {
  constructor(
    public readonly userId: string,
    public readonly testId?: string,
  ) {}
}

@QueryHandler(GetUserNotesQuery)
export class GetUserNotesHandler implements IQueryHandler<
  GetUserNotesQuery,
  UserNoteResponseDto[]
> {
  constructor(
    @InjectRepository(UserNoteEntity)
    private readonly noteRepo: Repository<UserNoteEntity>,
  ) {}

  async execute(query: GetUserNotesQuery): Promise<UserNoteResponseDto[]> {
    const where: Record<string, string> = { userId: query.userId };
    if (query.testId) {
      where.testId = query.testId;
    }
    const entities = await this.noteRepo.find({
      where,
      order: { updatedAt: 'DESC' },
    });

    return entities.map((entity) => new UserNoteResponseDto(entity));
  }
}
