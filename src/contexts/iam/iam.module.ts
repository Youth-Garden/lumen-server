import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamController } from './presentation/iam.controller';
import { RegisterUserHandler } from './application/commands/register-user.handler';
import { LoginUserHandler } from './application/commands/login-user.handler';
import { RefreshTokenHandler } from './application/commands/refresh-token.handler';
import { GoogleLoginHandler } from './application/commands/google-login.handler';
import { GetMeHandler } from './application/queries/get-me.handler';
import { UserRepository } from './infrastructure/typeorm/user.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { HashingService } from './infrastructure/services/hashing.service';
import { TokenService } from './infrastructure/services/token.service';
import { JwtStrategy } from '../../shared-kernel/strategies/jwt.strategy';
import { UserEntity } from './infrastructure/typeorm/entities/user.entity';
import { SessionEntity } from './infrastructure/typeorm/entities/session.entity';
import { TypedConfigService } from '../../config/typed-config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, SessionEntity]),
    CqrsModule,
    JwtModule.registerAsync({
      inject: [TypedConfigService],
      useFactory: (config: TypedConfigService) => ({
        secret: config.jwt.secret,
        signOptions: {
          expiresIn: config.jwt.expiresIn,
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
    GetMeHandler,
    HashingService,
    TokenService,
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class IamModule {}
