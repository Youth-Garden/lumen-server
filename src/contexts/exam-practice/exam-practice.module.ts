import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExamAttemptEntity } from './infrastructure/entities/exam-attempt.entity';
import { ExamPracticeController } from './presentation/http/exam-practice.controller';
import { ExamAttemptRepository } from './infrastructure/repositories/exam-attempt.repository';
import { EXAM_ATTEMPT_REPOSITORY } from './domain/repositories/exam-attempt.repository.interface';

import { StartExamAttemptHandler } from './application/commands/start-exam-attempt.handler';
import { SubmitExamAnswerHandler } from './application/commands/submit-exam-answer.handler';
import { FinishExamAttemptHandler } from './application/commands/finish-exam-attempt.handler';
import { GetExamAttemptHandler } from './application/queries/get-exam-attempt.handler';

const CommandHandlers = [
  StartExamAttemptHandler,
  SubmitExamAnswerHandler,
  FinishExamAttemptHandler,
];

const QueryHandlers = [GetExamAttemptHandler];

const Repositories = [
  {
    provide: EXAM_ATTEMPT_REPOSITORY,
    useClass: ExamAttemptRepository,
  },
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ExamAttemptEntity])],
  controllers: [ExamPracticeController],
  providers: [...CommandHandlers, ...QueryHandlers, ...Repositories],
})
export class ExamPracticeModule {}
