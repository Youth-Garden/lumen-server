import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { EXAM_ATTEMPT_REPOSITORY } from '../../domain/repositories/exam-attempt.repository.interface';
import type { IExamAttemptRepository } from '../../domain/repositories/exam-attempt.repository.interface';
import { AppException } from '../../../../common/exceptions/app.exception';
import { ExamPracticeEx } from '../../domain/exceptions/exam-practice.exception';

export class ResumeExamAttemptCommand {
  constructor(
    public readonly userId: string,
    public readonly attemptId: string,
  ) {}
}

@CommandHandler(ResumeExamAttemptCommand)
export class ResumeExamAttemptHandler
  implements ICommandHandler<ResumeExamAttemptCommand, void>
{
  constructor(
    @Inject(EXAM_ATTEMPT_REPOSITORY)
    private readonly attemptRepo: IExamAttemptRepository,
  ) {}

  async execute(command: ResumeExamAttemptCommand): Promise<void> {
    const attempt = await this.attemptRepo.findById(command.attemptId);

    if (!attempt || attempt.userId !== command.userId) {
      throw new AppException(ExamPracticeEx.AttemptNotFound);
    }

    attempt.resume();

    await this.attemptRepo.save(attempt);
  }
}
