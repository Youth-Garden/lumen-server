import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamController } from './presentation/http/iam.controller';
import { SendEmailOtpHandler } from './application/commands/send-email-otp.handler';
import { VerifyEmailOtpHandler } from './application/commands/verify-email-otp.handler';
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
import { ConfigService } from '@nestjs/config';
import { IamEmailService } from './application/services/iam-email.service';
import { QueueModule } from '../../shared/infrastructure/queue/queue.module';
import { CommonModule } from '../../shared/shared.module';
import { TypedConfigService } from '../../shared/infrastructure/config';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([UserEntity, SessionEntity]),
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
    SendEmailOtpHandler,
    VerifyEmailOtpHandler,
    RefreshTokenHandler,
    GoogleLoginHandler,
    LogoutHandler,
    GetMeHandler,
    ListSessionsHandler,
    UpdateProfileHandler,
    HashingService,
    TokenService,
    GoogleAuthService,
    JwtStrategy,
    IamEmailService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    TypedConfigService,
  ],
})
export class IamModule {}
