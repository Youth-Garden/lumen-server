import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExamPracticeModule } from './contexts/exam-practice/exam-practice.module';
import { GrammarModule } from './contexts/grammar/grammar.module';
import { IamModule } from './contexts/iam/iam.module';
import { ListeningSpeakingModule } from './contexts/listening-speaking/listening-speaking.module';
import { MaterialModule } from './contexts/material/material.module';
import { NotificationModule } from './contexts/notification/notification.module';
import { ProgressModule } from './contexts/progress/progress.module';
import { QuizModule } from './contexts/quiz/quiz.module';
import { ReadingModule } from './contexts/reading/reading.module';
import { ToeicModule } from './contexts/toeic/toeic.module';
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
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { RequestContextMiddleware } from './shared/infrastructure/database/request-context.middleware';
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
      inject: [TypedConfigService],
      useFactory: async (configService: TypedConfigService) => {
        const url = configService.infrastructure.redis.url;
        const store = await redisStore({ url });
        return {
          store,
          ttl: 30000, // Default 30 seconds
        };
      },
    }),
    IamModule,
    VocabularyModule,
    DatabaseModule,
    QuizModule,
    ProgressModule,
    ReadingModule,
    ToeicModule,
    MaterialModule,
    GrammarModule,
    ListeningSpeakingModule,
    ExamPracticeModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TypedConfigService,
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
