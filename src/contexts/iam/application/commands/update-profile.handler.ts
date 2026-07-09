import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProfileCommand } from './update-profile.command';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UserResponseDto } from '../responses/user.response.dto';
import { AppException } from '../../../../shared-kernel/exceptions';
import { AuthEx } from '../../domain/exceptions/auth.exception';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<
  UpdateProfileCommand,
  UserResponseDto
> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new AppException(AuthEx.InvalidCredentials);
    }

    user.updateProfile(command.fullName, command.avatarUrl, command.phone);
    const updatedUser = await this.userRepository.save(user);

    return new UserResponseDto(updatedUser);
  }
}
