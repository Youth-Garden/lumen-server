import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamController } from './presentation/http/iam.controller';
import { RegisterUserHandler } from './application/commands/register-user.handler';
import { LoginUserHandler } from './application/commands/login-user.handler';
import { RefreshTokenHandler } from './application/commands/refresh-token.handler';
import { GoogleLoginHandler } from './application/commands/google-login.handler';
import { LogoutHandler } from './application/commands/logout.handler';
import { GetMeHandler } from './application/queries/get-me.handler';
import { ListSessionsHandler } from './application/queries/list-sessions.handler';
import { UpdateProfileHandler } from './application/commands/update-profile.handler';
import { UserRepository } from './infrastructure/user.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import {
  HashingService,
  TokenService,
  GoogleAuthService,
} from '../../shared/application/services';
import { JwtStrategy } from '../../shared/infrastructure/strategies/jwt.strategy';
import { UserEntity } from './infrastructure/entities/user.entity';
import { SessionEntity } from './infrastructure/entities/session.entity';
import { PasswordResetTokenEntity } from './infrastructure/entities/password-reset-token.entity';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordHandler } from './application/commands/forgot-password.handler';
import { ResetPasswordHandler } from './application/commands/reset-password.handler';
import { IamEmailService } from './application/services/iam-email.service';
import { QueueModule } from '../../shared/infrastructure/queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SessionEntity,
      PasswordResetTokenEntity,
    ]),
    CqrsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: config.get<number>('jwt.expiresIn'),
        },
      }),
    }),
    QueueModule,
  ],
  controllers: [IamController],
  providers: [
    RegisterUserHandler,
    LoginUserHandler,
    RefreshTokenHandler,
    GoogleLoginHandler,
    LogoutHandler,
    GetMeHandler,
    ListSessionsHandler,
    UpdateProfileHandler,
    ForgotPasswordHandler,
    ResetPasswordHandler,
    HashingService,
    TokenService,
    GoogleAuthService,
    JwtStrategy,
    IamEmailService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class IamModule {}
