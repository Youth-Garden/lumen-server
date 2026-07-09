import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AppException } from '../../../../shared-kernel/exceptions';
import { QuizEx } from '../../domain/exceptions/quiz.exception';
import { SubmitAnswerCommand } from './submit-answer.command';
import type { IQuizRepository } from '../../domain/repositories/quiz.repository.interface';
import { QUIZ_REPOSITORY } from '../../domain/repositories/quiz.repository.interface';

@CommandHandler(SubmitAnswerCommand)
export class SubmitAnswerHandler implements ICommandHandler<
  SubmitAnswerCommand,
  void
> {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepo: IQuizRepository,
  ) {}

  async execute(command: SubmitAnswerCommand): Promise<void> {
    const { quizId, questionId, answer, userId } = command;

    const quiz = await this.quizRepo.findByIdAndUserId(quizId, userId);
    if (!quiz) throw new AppException(QuizEx.NotFound());

    quiz.submitAnswer(questionId, answer);

    await this.quizRepo.save(quiz);
  }
}
