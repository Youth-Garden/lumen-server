import { Body, Controller, Post, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import type { FastifyRequest } from 'fastify';
import { RegisterUserDto } from '../application/dto/register-user.dto';
import { RegisterUserCommand } from '../application/commands/register-user.command';
import { LoginUserDto } from '../application/dto/login-user.dto';
import { LoginUserCommand } from '../application/commands/login-user.command';

@Controller('iam')
export class IamController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto): Promise<void> {
    await this.commandBus.execute(
      new RegisterUserCommand(dto.email, dto.password),
    );
  }

  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Req() req: FastifyRequest,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;
    const result = (await this.commandBus.execute(
      new LoginUserCommand(dto.email, dto.password, userAgent, ipAddress),
    )) as unknown;
    return result as { accessToken: string; refreshToken: string };
  }
}
