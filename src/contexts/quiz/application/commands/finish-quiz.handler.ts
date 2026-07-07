import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { FinishQuizCommand } from './finish-quiz.command';
import type { IQuizRepository } from '../../domain/repositories/quiz.repository.interface';
import { QUIZ_REPOSITORY } from '../../domain/repositories/quiz.repository.interface';

@CommandHandler(FinishQuizCommand)
export class FinishQuizHandler implements ICommandHandler<
  FinishQuizCommand,
  number
> {
  constructor(
    @Inject(QUIZ_REPOSITORY)
    private readonly quizRepo: IQuizRepository,
  ) {}

  async execute(command: FinishQuizCommand): Promise<number> {
    const { quizId, userId } = command;

    const quiz = await this.quizRepo.findById(quizId);
    if (!quiz) throw new NotFoundException('Quiz not found');
    if (quiz.userId !== userId) throw new BadRequestException('Not your quiz');

    quiz.finish();

    await this.quizRepo.save(quiz);

    return quiz.score;
  }
}
