import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, BadRequestException, NotFoundException } from '@nestjs/common';
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
    const { quizId, questionId, dto, userId } = command;

    const quiz = await this.quizRepo.findById(quizId);
    if (!quiz) throw new NotFoundException('Quiz not found');
    if (quiz.userId !== userId) throw new BadRequestException('Not your quiz');

    quiz.submitAnswer(questionId, dto.answer);

    await this.quizRepo.save(quiz);
  }
}
