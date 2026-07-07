import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListSessionsQuery } from './list-sessions.query';
import {
  USER_REPOSITORY,
  Session,
} from '../../domain/repositories/user.repository.interface';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';

@QueryHandler(ListSessionsQuery)
export class ListSessionsHandler implements IQueryHandler<
  ListSessionsQuery,
  Session[]
> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: ListSessionsQuery): Promise<Session[]> {
    return this.userRepository.listSessions(query.userId);
  }
}
