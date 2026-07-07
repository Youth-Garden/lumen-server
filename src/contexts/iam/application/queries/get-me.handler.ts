import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMeQuery } from './get-me.query';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { AppException, AuthEx } from '../../../../shared-kernel/exceptions';

@QueryHandler(GetMeQuery)
export class GetMeHandler implements IQueryHandler<GetMeQuery> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    query: GetMeQuery,
  ): Promise<{ id: string; email: string; role: string }> {
    const user = await this.userRepository.findById(query.userId);
    if (!user) {
      throw new AppException(AuthEx.InvalidCredentials);
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
