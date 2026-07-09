import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreatePresetQuizCommand } from './create-preset-quiz.command';
import type { IPresetQuizRepository } from '../../domain/repositories/preset-quiz.repository.interface';
import { PRESET_QUIZ_REPOSITORY } from '../../domain/repositories/preset-quiz.repository.interface';
import { PresetQuiz } from '../../domain/aggregates/preset-quiz.aggregate';
import { randomUUID } from 'crypto';

@CommandHandler(CreatePresetQuizCommand)
export class CreatePresetQuizHandler implements ICommandHandler<
  CreatePresetQuizCommand,
  string
> {
  constructor(
    @Inject(PRESET_QUIZ_REPOSITORY)
    private readonly repo: IPresetQuizRepository,
  ) {}

  async execute(command: CreatePresetQuizCommand): Promise<string> {
    const { title, description, isPublished } = command.dto;
    const quizId = randomUUID();

    const quiz = PresetQuiz.create(quizId, title, description, isPublished);
    await this.repo.save(quiz);

    return quizId;
  }
}
