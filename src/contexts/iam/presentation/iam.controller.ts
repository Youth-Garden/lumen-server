import { Body, Controller, Post, Req, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
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
import { LogoutDto } from '../application/dto/logout.dto';
import { SessionResponseDto } from '../application/dto/session.response.dto';
import { LogoutCommand } from '../application/commands/logout.command';
import { ListSessionsQuery } from '../application/queries/list-sessions.query';
import { Public } from '../../../shared-kernel/decorators/public.decorator';

@ApiTags('IAM')
@Controller('iam')
export class IamController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Create a new local account with email and password.',
  })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({
    status: 400,
    description: 'Email already exists or validation error.',
  })
  async register(@Body() dto: RegisterUserDto): Promise<void> {
    await this.commandBus.execute(
      new RegisterUserCommand(dto.email, dto.password),
    );
  }

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Login with email & password',
    description:
      'Authenticate with email and password. Returns access and refresh tokens.',
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 201,
    description: 'Login successful. Returns access & refresh tokens.',
    type: AuthTokensResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
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

  @Public()
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Exchange a valid refresh token for a new access token and refresh token pair (token rotation).',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 201,
    description: 'Tokens refreshed successfully.',
    type: AuthTokensResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token is invalid or expired.',
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

  @Public()
  @Post('google-login')
  @ApiOperation({
    summary: 'Login with Google OAuth2',
    description:
      'Authenticate using a Google ID token obtained from the client-side Google Sign-In flow. Creates a new account if the email does not exist.',
  })
  @ApiBody({ type: GoogleLoginDto })
  @ApiResponse({
    status: 201,
    description: 'Google login successful. Returns access & refresh tokens.',
    type: GoogleLoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired Google ID token.',
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
  @ApiOperation({
    summary: 'Get current logged-in user',
    description:
      'Returns the profile of the currently authenticated user. Requires a valid JWT access token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user profile.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Missing or invalid access token.',
  })
  async getMe(@Req() req: RequestWithUser): Promise<UserResponseDto> {
    const user = req.user;
    const result = await this.queryBus.execute<GetMeQuery, UserResponseDto>(
      new GetMeQuery(user.sub),
    );
    return result;
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout user',
    description: 'Revoke the specified refresh token, ending the session.',
  })
  @ApiBody({ type: LogoutDto })
  @ApiResponse({ status: 201, description: 'Logged out successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async logout(@Body() dto: LogoutDto): Promise<void> {
    await this.commandBus.execute(new LogoutCommand(dto.refreshToken));
  }

  @Get('sessions')
  @ApiOperation({
    summary: 'List active sessions',
    description: 'Get all active sessions for the current logged-in user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of sessions.',
    type: [SessionResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getSessions(
    @Req() req: RequestWithUser,
  ): Promise<SessionResponseDto[]> {
    const user = req.user;
    const result = await this.queryBus.execute<
      ListSessionsQuery,
      SessionResponseDto[]
    >(new ListSessionsQuery(user.sub));
    return result;
  }
}
