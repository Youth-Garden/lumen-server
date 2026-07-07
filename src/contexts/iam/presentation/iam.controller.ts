import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import type { FastifyRequest } from 'fastify';
import { RegisterUserDto } from '../application/dto/register-user.dto';
import { RegisterUserCommand } from '../application/commands/register-user.command';
import { LoginUserDto } from '../application/dto/login-user.dto';
import { LoginUserCommand } from '../application/commands/login-user.command';

@ApiTags('IAM')
@Controller('iam')
export class IamController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  async register(@Body() dto: RegisterUserDto): Promise<void> {
    await this.commandBus.execute(
      new RegisterUserCommand(dto.email, dto.password),
    );
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 201, description: 'User successfully logged in' })
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
