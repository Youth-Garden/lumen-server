import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMeQuery } from './get-me.query';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { AppException } from '../../../../shared/domain/exceptions';
import { AuthEx } from '../../domain/exceptions/auth.exception';
import { UserResponseDto } from '../responses/user.response.dto';

@QueryHandler(GetMeQuery)
export class GetMeHandler implements IQueryHandler<
  GetMeQuery,
  UserResponseDto
> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(query: GetMeQuery): Promise<UserResponseDto> {
    const cacheKey = `user_profile_${query.userId}`;
    const cachedProfile =
      await this.cacheManager.get<UserResponseDto>(cacheKey);

    if (cachedProfile) {
      return cachedProfile;
    }

    const user = await this.userRepository.findById(query.userId);
    if (!user) {
      throw new AppException(AuthEx.InvalidCredentials);
    }

    const profile = new UserResponseDto(user);
    await this.cacheManager.set(cacheKey, profile, 60000); // cache for 1 minute

    return profile;
  }
}
