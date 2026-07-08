import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamController } from './presentation/iam.controller';
import { RegisterUserHandler } from './application/commands/register-user.handler';
import { LoginUserHandler } from './application/commands/login-user.handler';
import { RefreshTokenHandler } from './application/commands/refresh-token.handler';
import { GoogleLoginHandler } from './application/commands/google-login.handler';
import { LogoutHandler } from './application/commands/logout.handler';
import { GetMeHandler } from './application/queries/get-me.handler';
import { ListSessionsHandler } from './application/queries/list-sessions.handler';
import { UserRepository } from './infrastructure/typeorm/user.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { HashingService } from './infrastructure/services/hashing.service';
import { TokenService } from './infrastructure/services/token.service';
import { GoogleAuthService } from './infrastructure/services/google-auth.service';
import { JwtStrategy } from '../../shared-kernel/strategies/jwt.strategy';
import { UserEntity } from './infrastructure/typeorm/entities/user.entity';
import { SessionEntity } from './infrastructure/typeorm/entities/session.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
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
    HashingService,
    TokenService,
    GoogleAuthService,
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class IamModule {}
