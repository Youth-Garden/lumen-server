import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamController } from './presentation/iam.controller';
import { RegisterUserHandler } from './application/commands/register-user.handler';
import { LoginUserHandler } from './application/commands/login-user.handler';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { PasswordHashingService } from './infrastructure/services/password-hashing.service';
import { TokenService } from './infrastructure/services/token.service';
import { JwtStrategy } from '../../shared-kernel/strategies/jwt.strategy';
import { UserOrmEntity } from './infrastructure/persistence/entities/user.orm-entity';
import { SessionOrmEntity } from './infrastructure/persistence/entities/session.orm-entity';
import { TypedConfigService } from '../../config/typed-config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity, SessionOrmEntity]),
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
    PasswordHashingService,
    TokenService,
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class IamModule {}
