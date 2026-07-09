import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMeQuery } from './get-me.query';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { AppException } from '../../../../common/exceptions';
import { AuthEx } from '../../domain/exceptions/auth.exception';
import { UserResponseDto } from '../responses/user.response.dto';

@QueryHandler(GetMeQuery)
export class GetMeHandler implements IQueryHandler<
  GetMeQuery,
  UserResponseDto
> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetMeQuery): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(query.userId);
    if (!user) {
      throw new AppException(AuthEx.InvalidCredentials);
    }

    return new UserResponseDto(user);
  }
}
