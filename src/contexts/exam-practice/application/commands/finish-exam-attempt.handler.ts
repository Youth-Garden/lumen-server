import {
  CommandHandler,
  ICommandHandler,
  EventBus,
  QueryBus,
} from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { EXAM_ATTEMPT_REPOSITORY } from '../../domain/repositories/exam-attempt.repository.interface';
import type { IExamAttemptRepository } from '../../domain/repositories/exam-attempt.repository.interface';
import { AppException } from '../../../../common/exceptions/app.exception';
import { ExamPracticeEx } from '../../domain/exceptions/exam-practice.exception';
import { ExamType } from '../../domain/enums/exam.enum';
import { GetToeicTestByIdQuery } from '../../../toeic/application/queries/get-toeic-test-by-id.query';
import { ToeicTestResponseDto } from '../../../toeic/application/responses/toeic-test.response.dto';

export class FinishExamAttemptCommand {
  constructor(
    public readonly userId: string,
    public readonly attemptId: string,
  ) {}
}

@CommandHandler(FinishExamAttemptCommand)
export class FinishExamAttemptHandler implements ICommandHandler<
  FinishExamAttemptCommand,
  void
> {
  constructor(
    @Inject(EXAM_ATTEMPT_REPOSITORY)
    private readonly attemptRepo: IExamAttemptRepository,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: FinishExamAttemptCommand): Promise<void> {
    const attempt = await this.attemptRepo.findById(command.attemptId);

    if (!attempt || attempt.userId !== command.userId) {
      throw new AppException(ExamPracticeEx.AttemptNotFound);
    }

    if (attempt.testType === ExamType.TOEIC) {
      // Query toeic context to get the correct answers
      const testInfo = await this.queryBus.execute<
        GetToeicTestByIdQuery,
        ToeicTestResponseDto
      >(new GetToeicTestByIdQuery(attempt.testId));

      const correctAnswersMap = new Map<
        string,
        { part: number; correctAnswer: string }
      >();

      if (testInfo.questions) {
        testInfo.questions.forEach((q) => {
          correctAnswersMap.set(q.id, {
            part: q.part,
            correctAnswer: q.correctAnswer,
          });
        });
      }

      attempt.finish(correctAnswersMap);
    } else {
      // Future IELTS or other tests
      throw new Error('Unsupported test type');
    }

    await this.attemptRepo.save(attempt);

    // Publish domain events (ExamAttemptCompletedEvent)
    attempt.getUncommittedEvents().forEach((domainEvent) => {
      this.eventBus.publish(domainEvent);
    });
    attempt.commit();
  }
}
