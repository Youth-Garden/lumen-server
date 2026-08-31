import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { FastifyRequest } from 'fastify';
import { TypedConfigService } from '../../../../shared/infrastructure/config/typed-config.service';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { Public } from '../../../../shared/presentation/decorators/public.decorator';
import { RefreshToken } from '../../../../shared/presentation/decorators/refresh-token.decorator';
import { GoogleLoginCommand } from '../../application/commands/google-login.command';
import { LogoutCommand } from '../../application/commands/logout.command';
import { RefreshTokenCommand } from '../../application/commands/refresh-token.command';
import { SendEmailOtpCommand } from '../../application/commands/send-email-otp.command';
import { UpdateProfileCommand } from '../../application/commands/update-profile.command';
import { VerifyEmailOtpCommand } from '../../application/commands/verify-email-otp.command';
import {
  SendEmailOtpDto,
  VerifyEmailOtpDto,
} from '../../application/dtos/email-otp.dto';
import { GoogleLoginDto } from '../../application/dtos/google-login.dto';
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
  @Post('email-otp/send')
  @ApiOperation({
    summary: 'Send email verification OTP',
    description:
      'Generates a 6-digit OTP, stores it (hashed) and emails it to the address. No password required.',
  })
  @ApiBody({ type: SendEmailOtpDto })
  @ApiResponse({ status: 201, description: 'OTP sent to the email address.' })
  async sendEmailOtp(@Body() dto: SendEmailOtpDto): Promise<void> {
    await this.commandBus.execute<SendEmailOtpCommand, void>(
      new SendEmailOtpCommand(dto.email),
    );
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  @ApiOperation({
    summary: 'Verify email OTP and login',
    description:
      'Verifies the OTP sent to the email. Creates a new account on first use. Returns access and refresh tokens.',
  })
  @ApiBody({ type: VerifyEmailOtpDto })
  @ApiResponse({
    status: 201,
    description: 'Login successful. Returns access & refresh tokens.',
    type: AuthTokensResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid email or OTP.' })
  async login(
    @Body() dto: VerifyEmailOtpDto,
    @Req() req: FastifyRequest,
  ): Promise<AuthTokensResponseDto> {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;
    return this.commandBus.execute<
      VerifyEmailOtpCommand,
      AuthTokensResponseDto
    >(new VerifyEmailOtpCommand(dto.email, dto.otp, userAgent, ipAddress));
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
  ): Promise<AuthTokensResponseDto> {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    return this.commandBus.execute<RefreshTokenCommand, AuthTokensResponseDto>(
      new RefreshTokenCommand(token, userAgent, ipAddress),
    );
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
    return this.commandBus.execute<GoogleLoginCommand, GoogleLoginResponseDto>(
      new GoogleLoginCommand(dto.idToken, userAgent, ipAddress),
    );
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
    @RefreshToken({ required: false }) token: string | null,
  ): Promise<void> {
    if (token) {
      await this.commandBus.execute<LogoutCommand, void>(
        new LogoutCommand(token),
      );
    }
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
