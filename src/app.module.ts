import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IamModule } from './contexts/iam/iam.module';
import { MaterialModule } from './contexts/material/material.module';
import { NotificationModule } from './contexts/notification/notification.module';
import { ProgressModule } from './contexts/progress/progress.module';
import { VocabularyModule } from './contexts/vocabulary/vocabulary.module';
import {
  appConfig,
  databaseConfig,
  iamConfig,
  infrastructureConfig,
  jwtConfig,
  TypedConfigService,
  validationSchema,
} from './shared/infrastructure/config';
import { SharedCqrsModule } from './shared/application/cqrs/shared-cqrs.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { RequestContextMiddleware } from './shared/infrastructure/database/request-context.middleware';
import { EnrichmentModule } from './shared/infrastructure/enrichment';
import { KeepAliveService } from './shared/infrastructure/keep-alive/keep-alive.service';
import { JwtAuthGuard } from './shared/presentation/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        jwtConfig,
        databaseConfig,
        iamConfig,
        infrastructureConfig,
      ],
      validationSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          ttl: 30000,
        };
      },
    }),
    SharedCqrsModule,
    EnrichmentModule,
    IamModule,
    VocabularyModule,
    DatabaseModule,
    ProgressModule,
    MaterialModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TypedConfigService,
    KeepAliveService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [TypedConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
