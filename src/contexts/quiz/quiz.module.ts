import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { QuizEntity } from './infrastructure/typeorm/entities/quiz.entity';
import { QuestionEntity } from './infrastructure/typeorm/entities/question.entity';
import { QuizController } from './presentation/http/quiz.controller';
import { GenerateQuizHandler } from './application/commands/generate-quiz.handler';
import { SubmitAnswerHandler } from './application/commands/submit-answer.handler';
import { FinishQuizHandler } from './application/commands/finish-quiz.handler';
import { QUIZ_REPOSITORY } from './domain/repositories/quiz.repository.interface';
import { QuizRepository } from './infrastructure/typeorm/repositories/quiz.repository';
import { VocabularyModule } from '../vocabulary/vocabulary.module';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([QuizEntity, QuestionEntity]),
    VocabularyModule,
  ],
  controllers: [QuizController],
  providers: [
    GenerateQuizHandler,
    SubmitAnswerHandler,
    FinishQuizHandler,
    {
      provide: QUIZ_REPOSITORY,
      useClass: QuizRepository,
    },
  ],
})
export class QuizModule {}
