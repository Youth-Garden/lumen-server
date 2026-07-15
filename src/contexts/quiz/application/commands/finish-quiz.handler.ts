import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AppException } from '../../../../shared/domain/exceptions';
import { QuizEx } from '../../domain/exceptions/quiz.exception';
import { FinishQuizCommand } from './finish-quiz.command';
import type { IQuizRepository } from '../../domain/repositories/quiz.repository.interface';
import { QUIZ_REPOSITORY } from '../../domain/repositories/quiz.repository.interface';
import { QuizCompletedEvent } from '../../../../shared/domain/events/quiz-completed.event';

@CommandHandler(FinishQuizCommand)
export class FinishQuizHandler implements ICommandHandler<
  FinishQuizCommand,
  number
> {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepo: IQuizRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: FinishQuizCommand): Promise<number> {
    const { quizId, userId } = command;

    const quiz = await this.quizRepo.findByIdAndUserId(quizId, userId);
    if (!quiz) throw new AppException(QuizEx.NotFound());

    quiz.finish();

    await this.quizRepo.save(quiz);

    this.eventBus.publish(new QuizCompletedEvent(userId, quizId, quiz.score));

    return quiz.score;
  }
}
