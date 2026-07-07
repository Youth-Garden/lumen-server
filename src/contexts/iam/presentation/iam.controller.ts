import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { FastifyRequest } from 'fastify';

type RequestWithUser = FastifyRequest & { user: { sub: string } };
import { GetMeQuery } from '../application/queries/get-me.query';
import { RegisterUserDto } from '../application/dto/register-user.dto';
import { RegisterUserCommand } from '../application/commands/register-user.command';
import { LoginUserDto } from '../application/dto/login-user.dto';
import { LoginUserCommand } from '../application/commands/login-user.command';
import { RefreshTokenDto } from '../application/dto/refresh-token.dto';
import { RefreshTokenCommand } from '../application/commands/refresh-token.command';
import { GoogleLoginDto } from '../application/dto/google-login.dto';
import { GoogleLoginCommand } from '../application/commands/google-login.command';
import {
  AuthTokensResponseDto,
  GoogleLoginResponseDto,
} from '../application/dto/auth-tokens.response.dto';
import { UserResponseDto } from '../application/dto/user.response.dto';
import { JwtAuthGuard } from '../../../shared-kernel/guards/jwt-auth.guard';
import { UseGuards, Get } from '@nestjs/common';

@ApiTags('IAM')
@Controller('iam')
export class IamController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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
  @ApiResponse({
    status: 201,
    description: 'User successfully logged in',
    type: AuthTokensResponseDto,
  })
  async login(
    @Body() dto: LoginUserDto,
    @Req() req: FastifyRequest,
  ): Promise<AuthTokensResponseDto> {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;
    const result = await this.commandBus.execute<
      LoginUserCommand,
      AuthTokensResponseDto
    >(new LoginUserCommand(dto.email, dto.password, userAgent, ipAddress));
    return result;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({
    status: 201,
    description: 'Tokens successfully refreshed',
    type: AuthTokensResponseDto,
  })
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Req() req: FastifyRequest,
  ): Promise<AuthTokensResponseDto> {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;
    const result = await this.commandBus.execute<
      RefreshTokenCommand,
      AuthTokensResponseDto
    >(new RefreshTokenCommand(dto.refreshToken, userAgent, ipAddress));
    return result;
  }

  @Post('google-login')
  @ApiOperation({ summary: 'Login via Google' })
  @ApiResponse({
    status: 201,
    description: 'User successfully logged in via Google',
    type: GoogleLoginResponseDto,
  })
  async googleLogin(
    @Body() dto: GoogleLoginDto,
    @Req() req: FastifyRequest,
  ): Promise<GoogleLoginResponseDto> {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;
    const result = await this.commandBus.execute<
      GoogleLoginCommand,
      GoogleLoginResponseDto
    >(new GoogleLoginCommand(dto.idToken, userAgent, ipAddress));
    return result;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current logged in user' })
  @ApiResponse({
    status: 200,
    description: 'Current user retrieved successfully',
    type: UserResponseDto,
  })
  async getMe(@Req() req: RequestWithUser): Promise<UserResponseDto> {
    const user = req.user;
    const result = await this.queryBus.execute<GetMeQuery, UserResponseDto>(
      new GetMeQuery(user.sub),
    );
    return result;
  }
}
