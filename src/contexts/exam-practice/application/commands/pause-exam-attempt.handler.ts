import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { EXAM_ATTEMPT_REPOSITORY } from '../../domain/repositories/exam-attempt.repository.interface';
import type { IExamAttemptRepository } from '../../domain/repositories/exam-attempt.repository.interface';
import { AppException } from '../../../../shared/domain/exceptions/app.exception';
import { ExamPracticeEx } from '../../domain/exceptions/exam-practice.exception';

export class PauseExamAttemptCommand {
  constructor(
    public readonly userId: string,
    public readonly attemptId: string,
    public readonly elapsedSeconds: number,
  ) {}
}

@CommandHandler(PauseExamAttemptCommand)
export class PauseExamAttemptHandler implements ICommandHandler<
  PauseExamAttemptCommand,
  void
> {
  constructor(
    @Inject(EXAM_ATTEMPT_REPOSITORY)
    private readonly attemptRepo: IExamAttemptRepository,
  ) {}

  async execute(command: PauseExamAttemptCommand): Promise<void> {
    const attempt = await this.attemptRepo.findById(command.attemptId);

    if (!attempt || attempt.userId !== command.userId) {
      throw new AppException(ExamPracticeEx.AttemptNotFound);
    }

    attempt.pause(command.elapsedSeconds);

    await this.attemptRepo.save(attempt);
  }
}
