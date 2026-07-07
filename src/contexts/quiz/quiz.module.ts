import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { QuizEntity } from './infrastructure/typeorm/entities/quiz.entity';
import { QuestionEntity } from './infrastructure/typeorm/entities/question.entity';
import { QuizController } from './presentation/http/quiz.controller';
import { GenerateQuizHandler } from './application/commands/generate-quiz.handler';
import { SubmitAnswerHandler } from './application/commands/submit-answer.handler';
import { FinishQuizHandler } from './application/commands/finish-quiz.handler';
import { ListQuizzesHandler } from './application/queries/list-quizzes.handler';
import { GetQuizByIdHandler } from './application/queries/get-quiz-by-id.handler';
import { QUIZ_REPOSITORY } from './domain/repositories/quiz.repository.interface';
import { QuizRepository } from './infrastructure/typeorm/repositories/quiz.repository';
import { QuizQuestionGeneratorService } from './domain/services/quiz-question-generator.service';
import { VocabularyModule } from '../vocabulary/vocabulary.module';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([QuizEntity, QuestionEntity]),
    VocabularyModule,
  ],
  controllers: [QuizController],
  providers: [
    QuizQuestionGeneratorService,
    GenerateQuizHandler,
    SubmitAnswerHandler,
    FinishQuizHandler,
    ListQuizzesHandler,
    GetQuizByIdHandler,
    {
      provide: QUIZ_REPOSITORY,
      useClass: QuizRepository,
    },
  ],
})
export class QuizModule {}
