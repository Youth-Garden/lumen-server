/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import '@fastify/cookie';
import { Body, Controller, Get, Post, Put, Req, Res } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { TypedConfigService } from '../../../../shared/infrastructure/config/typed-config.service';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { Public } from '../../../../shared/presentation/decorators/public.decorator';
import { RefreshToken } from '../../../../shared/presentation/decorators/refresh-token.decorator';
import { ForgotPasswordCommand } from '../../application/commands/forgot-password.command';
import { GoogleLoginCommand } from '../../application/commands/google-login.command';
import { LoginUserCommand } from '../../application/commands/login-user.command';
import { LogoutCommand } from '../../application/commands/logout.command';
import { RefreshTokenCommand } from '../../application/commands/refresh-token.command';
import { RegisterUserCommand } from '../../application/commands/register-user.command';
import { ResetPasswordCommand } from '../../application/commands/reset-password.command';
import { UpdateProfileCommand } from '../../application/commands/update-profile.command';
import { ForgotPasswordDto } from '../../application/dtos/forgot-password.dto';
import { GoogleLoginDto } from '../../application/dtos/google-login.dto';
import { LoginUserDto } from '../../application/dtos/login-user.dto';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import { ResetPasswordDto } from '../../application/dtos/reset-password.dto';
import { UpdateProfileDto } from '../../application/dtos/update-profile.dto';
import { GetMeQuery } from '../../application/queries/get-me.query';
import { ListSessionsQuery } from '../../application/queries/list-sessions.query';
import {
  AuthTokensResponseDto,
  GoogleLoginResponseDto,
} from '../../application/responses/auth-tokens.response.dto';
import { SessionResponseDto } from '../../application/responses/session.response.dto';
import { UserResponseDto } from '../../application/responses/user.response.dto';

@ApiTags('IAM')
@Controller('iam')
export class IamController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly configService: TypedConfigService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
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
    await this.commandBus.execute<RegisterUserCommand, void>(
      new RegisterUserCommand(dto.email, dto.password),
    );
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('forgot-password')
  @ApiOperation({
    summary: 'Request a password reset',
    description: 'Generates a reset token and logs the reset link.',
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 201, description: 'Reset request processed.' })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await this.commandBus.execute<ForgotPasswordCommand, void>(
      new ForgotPasswordCommand(dto.email),
    );
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password using token',
    description: 'Resets the password using the token sent to the email.',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 201, description: 'Password successfully reset.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.commandBus.execute<ResetPasswordCommand, void>(
      new ResetPasswordCommand(dto.token, dto.newPassword),
    );
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
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
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<AuthTokensResponseDto> {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;
    const result = await this.commandBus.execute<
      LoginUserCommand,
      AuthTokensResponseDto
    >(new LoginUserCommand(dto.email, dto.password, userAgent, ipAddress));

    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return result;
  }

  @Public()
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Exchange a valid refresh token for a new access token and refresh token pair (token rotation).',
  })
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
    @RefreshToken() token: string,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<AuthTokensResponseDto> {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    const result = await this.commandBus.execute<
      RefreshTokenCommand,
      AuthTokensResponseDto
    >(new RefreshTokenCommand(token, userAgent, ipAddress));

    this.setAuthCookies(res, result.accessToken, result.refreshToken);
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
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<GoogleLoginResponseDto> {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;
    const result = await this.commandBus.execute<
      GoogleLoginCommand,
      GoogleLoginResponseDto
    >(new GoogleLoginCommand(dto.idToken, userAgent, ipAddress));

    this.setAuthCookies(res, result.accessToken, result.refreshToken);
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
  async getMe(@CurrentUser() userId: string): Promise<UserResponseDto> {
    const result = await this.queryBus.execute<GetMeQuery, UserResponseDto>(
      new GetMeQuery(userId),
    );
    return result;
  }

  @Public()
  @Post('logout')
  @ApiOperation({
    summary: 'Logout user',
    description: 'Revoke the specified refresh token, ending the session.',
  })
  @ApiResponse({ status: 201, description: 'Logged out successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async logout(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<void> {
    const token = (req as any).cookies?.jwtr || '';
    if (token) {
      await this.commandBus.execute<LogoutCommand, void>(
        new LogoutCommand(token),
      );
    }

    (res as any).clearCookie('jwta', { path: '/' });
    (res as any).clearCookie('jwtr', { path: '/' });
  }

  private setAuthCookies(
    res: FastifyReply,
    accessToken: string,
    refreshToken: string,
  ) {
    (res as any).cookie('jwta', accessToken, {
      httpOnly: true,
      secure: this.configService.app.nodeEnv === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: this.configService.jwt.expiresIn,
    });

    (res as any).cookie('jwtr', refreshToken, {
      httpOnly: true,
      secure: this.configService.app.nodeEnv === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: this.configService.jwt.refreshExpiresIn,
    });
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
    @CurrentUser() userId: string,
  ): Promise<SessionResponseDto[]> {
    const result = await this.queryBus.execute<
      ListSessionsQuery,
      SessionResponseDto[]
    >(new ListSessionsQuery(userId));
    return result;
  }

  @Put('profile')
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Update the profile details of the current logged-in user.',
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateProfile(
    @CurrentUser() userId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    return this.commandBus.execute<UpdateProfileCommand, UserResponseDto>(
      new UpdateProfileCommand(userId, dto.fullName, dto.avatarUrl, dto.phone),
    );
  }
}
