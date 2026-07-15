import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from './register-user.command';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { HashingService } from '../../../../shared/application/services';
import { AuthProvider } from '../../domain/enums/auth-provider.enum';
import { Role } from '../../domain/enums/role.enum';
import { AppException } from '../../../../shared/domain/exceptions';
import { AuthEx } from '../../domain/exceptions/auth.exception';
import { User } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../responses/user.response.dto';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<
  RegisterUserCommand,
  UserResponseDto
> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly hashingService: HashingService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new AppException(AuthEx.EmailAlreadyExists(command.email));
    }

    const password = await this.hashingService.hash(command.passwordRaw);

    const user = User.create(
      command.email,
      password,
      AuthProvider.LOCAL,
      null,
      Role.USER,
      null,
    );

    const newUser = await this.userRepository.save(user);

    return new UserResponseDto(newUser);
  }
}
