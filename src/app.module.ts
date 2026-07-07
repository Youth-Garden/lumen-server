import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IamModule } from './contexts/iam/iam.module';
import { DatabaseModule } from './shared-kernel/infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import {
  appConfig,
  jwtConfig,
  databaseConfig,
  validationSchema,
  TypedConfigService,
} from './config';
import { VocabularyModule } from './contexts/vocabulary/vocabulary.module';
import { QuizModule } from './contexts/quiz/quiz.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, databaseConfig],
      validationSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
    IamModule,
    VocabularyModule,
    DatabaseModule,
    QuizModule,
  ],
  controllers: [AppController],
  providers: [AppService, TypedConfigService],
  exports: [TypedConfigService],
})
export class AppModule {}
