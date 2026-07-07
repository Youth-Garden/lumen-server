import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from './register-user.command';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { PasswordHashingService } from '../../infrastructure/services/password-hashing.service';
import { AuthProvider } from '../../domain/enums/auth-provider.enum';
import { Role } from '../../domain/enums/role.enum';
import { AppException, AuthEx } from '../../../../shared-kernel/exceptions';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  async execute(
    command: RegisterUserCommand,
  ): Promise<{ id: string; email: string; role: string }> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new AppException(AuthEx.EmailAlreadyExists(command.email));
    }

    const password = await this.passwordHashingService.hash(
      command.passwordRaw,
    );

    const newUser = await this.userRepository.save({
      email: command.email,
      password,
      authProvider: AuthProvider.LOCAL,
      providerId: null,
      role: Role.USER,
      planId: null,
    });

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
  }
}
