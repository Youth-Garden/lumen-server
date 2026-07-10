import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { QuizEntity } from './infrastructure/entities/quiz.entity';
import { QuestionEntity } from './infrastructure/entities/question.entity';
import { QuizController } from './presentation/http/quiz.controller';
import { GenerateQuizHandler } from './application/commands/generate-quiz.handler';
import { SubmitAnswerHandler } from './application/commands/submit-answer.handler';
import { FinishQuizHandler } from './application/commands/finish-quiz.handler';
import { ListQuizzesHandler } from './application/queries/list-quizzes.handler';
import { GetQuizByIdHandler } from './application/queries/get-quiz-by-id.handler';
import { QUIZ_REPOSITORY } from './domain/repositories/quiz.repository.interface';
import { QuizRepository } from './infrastructure/repositories/quiz.repository';
import { QuizQuestionFactory } from './domain/factories/quiz-question.factory';
import { VocabularyModule } from '../vocabulary/vocabulary.module';

import { AdminQuizController } from './presentation/http/admin-quiz.controller';
import { PresetQuizEntity } from './infrastructure/entities/preset-quiz.entity';
import { PresetQuestionEntity } from './infrastructure/entities/preset-question.entity';
import { PresetQuizRepository } from './infrastructure/repositories/preset-quiz.repository';
import { PRESET_QUIZ_REPOSITORY } from './domain/repositories/preset-quiz.repository.interface';
import { CreatePresetQuizHandler } from './application/commands/create-preset-quiz.handler';
import {
  UpdatePresetQuizHandler,
  DeletePresetQuizHandler,
} from './application/commands/preset-quiz-extra.handlers';
import { ListPresetQuizzesHandler } from './application/queries/list-preset-quizzes.handler';
import { GetPresetQuizByIdHandler } from './application/queries/get-preset-quiz-by-id.handler';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      QuizEntity,
      QuestionEntity,
      PresetQuizEntity,
      PresetQuestionEntity,
    ]),
    VocabularyModule,
  ],
  controllers: [QuizController, AdminQuizController],
  providers: [
    QuizQuestionFactory,
    GenerateQuizHandler,
    SubmitAnswerHandler,
    FinishQuizHandler,
    ListQuizzesHandler,
    GetQuizByIdHandler,
    CreatePresetQuizHandler,
    UpdatePresetQuizHandler,
    DeletePresetQuizHandler,
    ListPresetQuizzesHandler,
    GetPresetQuizByIdHandler,
    {
      provide: QUIZ_REPOSITORY,
      useClass: QuizRepository,
    },
    {
      provide: PRESET_QUIZ_REPOSITORY,
      useClass: PresetQuizRepository,
    },
  ],
})
export class QuizModule {}
