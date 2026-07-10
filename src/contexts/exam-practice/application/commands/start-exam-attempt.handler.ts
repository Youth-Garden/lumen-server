import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ExamType } from '../../domain/enums/exam.enum';
import { ExamAttempt } from '../../domain/aggregates/exam-attempt.aggregate';
import { EXAM_ATTEMPT_REPOSITORY } from '../../domain/repositories/exam-attempt.repository.interface';
import type { IExamAttemptRepository } from '../../domain/repositories/exam-attempt.repository.interface';
import { randomUUID } from 'crypto';

export class StartExamAttemptCommand {
  constructor(
    public readonly userId: string,
    public readonly testId: string,
    public readonly testType: ExamType,
  ) {}
}

@CommandHandler(StartExamAttemptCommand)
export class StartExamAttemptHandler implements ICommandHandler<
  StartExamAttemptCommand,
  string
> {
  constructor(
    @Inject(EXAM_ATTEMPT_REPOSITORY)
    private readonly attemptRepo: IExamAttemptRepository,
  ) {}

  async execute(command: StartExamAttemptCommand): Promise<string> {
    const attempt = ExamAttempt.start(
      randomUUID(),
      command.userId,
      command.testId,
      command.testType,
    );

    await this.attemptRepo.save(attempt);

    return attempt.id;
  }
}
