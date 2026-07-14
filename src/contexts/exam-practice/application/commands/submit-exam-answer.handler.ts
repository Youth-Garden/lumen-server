import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { EXAM_ATTEMPT_REPOSITORY } from '../../domain/repositories/exam-attempt.repository.interface';
import type { IExamAttemptRepository } from '../../domain/repositories/exam-attempt.repository.interface';
import { AppException } from '../../../../common/exceptions/app.exception';
import { ExamPracticeEx } from '../../domain/exceptions/exam-practice.exception';

export class SubmitExamAnswerCommand {
  constructor(
    public readonly userId: string,
    public readonly attemptId: string,
    public readonly questionId: string,
    public readonly userAnswer: string,
    public readonly timeSpent?: number,
    public readonly flaggedHard?: boolean,
  ) {}
}

@CommandHandler(SubmitExamAnswerCommand)
export class SubmitExamAnswerHandler implements ICommandHandler<
  SubmitExamAnswerCommand,
  void
> {
  constructor(
    @Inject(EXAM_ATTEMPT_REPOSITORY)
    private readonly attemptRepo: IExamAttemptRepository,
  ) {}

  async execute(command: SubmitExamAnswerCommand): Promise<void> {
    const attempt = await this.attemptRepo.findById(command.attemptId);

    if (!attempt || attempt.userId !== command.userId) {
      throw new AppException(ExamPracticeEx.AttemptNotFound);
    }

    attempt.submitAnswer(
      command.questionId,
      command.userAnswer,
      command.timeSpent,
      command.flaggedHard,
    );

    await this.attemptRepo.save(attempt);
  }
}
