import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from './register-user.command';
import { Inject, ConflictException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { PasswordHashingService } from '../../infrastructure/services/password-hashing.service';

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
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await this.passwordHashingService.hash(
      command.passwordRaw,
    );

    const newUser = await this.userRepository.save({
      email: command.email,
      passwordHash,
      role: 'USER',
      planId: null,
    });

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
  }
}
