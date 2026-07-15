import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ExamAttempt } from '../../domain/aggregates/exam-attempt.aggregate';
import { EXAM_ATTEMPT_REPOSITORY } from '../../domain/repositories/exam-attempt.repository.interface';
import type { IExamAttemptRepository } from '../../domain/repositories/exam-attempt.repository.interface';
import { AppException } from '../../../../shared/domain/exceptions/app.exception';
import { ExamPracticeEx } from '../../domain/exceptions/exam-practice.exception';
import { ExamAttemptStatus } from '../../domain/enums/exam.enum';
import { randomUUID } from 'crypto';

export class StartRetestAttemptCommand {
  constructor(
    public readonly userId: string,
    public readonly sourceAttemptId: string,
  ) {}
}

@CommandHandler(StartRetestAttemptCommand)
export class StartRetestAttemptHandler implements ICommandHandler<
  StartRetestAttemptCommand,
  string
> {
  constructor(
    @Inject(EXAM_ATTEMPT_REPOSITORY)
    private readonly attemptRepo: IExamAttemptRepository,
  ) {}

  async execute(command: StartRetestAttemptCommand): Promise<string> {
    const sourceAttempt = await this.attemptRepo.findById(
      command.sourceAttemptId,
    );

    if (!sourceAttempt || sourceAttempt.userId !== command.userId) {
      throw new AppException(ExamPracticeEx.AttemptNotFound);
    }

    if (sourceAttempt.status !== ExamAttemptStatus.COMPLETED) {
      throw new AppException(ExamPracticeEx.AttemptNotCompleted);
    }

    const incorrectQuestionIds = sourceAttempt.answers
      .filter((answer) => answer.isCorrect === false)
      .map((answer) => answer.questionId);

    if (incorrectQuestionIds.length === 0) {
      throw new AppException(ExamPracticeEx.NoIncorrectAnswers);
    }

    const retestAttempt = ExamAttempt.startRetest(
      randomUUID(),
      command.userId,
      sourceAttempt.testId,
      sourceAttempt.testType,
      incorrectQuestionIds,
    );

    await this.attemptRepo.save(retestAttempt);

    return retestAttempt.id;
  }
}
