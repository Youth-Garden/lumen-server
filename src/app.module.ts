import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IamModule } from './contexts/iam/iam.module';
import { DatabaseModule } from './shared-kernel/infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import {
  appConfig,
  jwtConfig,
  databaseConfig,
  iamConfig,
  validationSchema,
  TypedConfigService,
} from './config';
import { VocabularyModule } from './contexts/vocabulary/vocabulary.module';
import { QuizModule } from './contexts/quiz/quiz.module';
import { ProgressModule } from './contexts/progress/progress.module';
import { ReadingModule } from './contexts/reading/reading.module';
import { ToeicModule } from './contexts/toeic/toeic.module';
import { MaterialModule } from './contexts/material/material.module';
import { JwtAuthGuard } from './shared-kernel/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, databaseConfig, iamConfig],
      validationSchema,
      validationOptions: {
        abortEarly: false,
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TypedConfigService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [TypedConfigService],
})
export class AppModule {}
