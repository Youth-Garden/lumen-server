import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  UpdatePresetQuizCommand,
  DeletePresetQuizCommand,
} from './preset-quiz-extra.commands';
import type { IPresetQuizRepository } from '../../domain/repositories/preset-quiz.repository.interface';
import { PRESET_QUIZ_REPOSITORY } from '../../domain/repositories/preset-quiz.repository.interface';

@CommandHandler(UpdatePresetQuizCommand)
export class UpdatePresetQuizHandler implements ICommandHandler<
  UpdatePresetQuizCommand,
  void
> {
  constructor(
    @Inject(PRESET_QUIZ_REPOSITORY)
    private readonly repo: IPresetQuizRepository,
  ) {}

  async execute(command: UpdatePresetQuizCommand): Promise<void> {
    const { id, dto } = command;
    const quiz = await this.repo.findById(id);
    if (!quiz) {
      throw new NotFoundException('Preset quiz not found');
    }

    if (dto.title !== undefined || dto.description !== undefined) {
      quiz.updateDetails(
        dto.title ?? quiz.title,
        dto.description ?? quiz.description,
      );
    }

    if (dto.isPublished !== undefined) {
      quiz.setPublished(dto.isPublished);
    }

    await this.repo.save(quiz);
  }
}

@CommandHandler(DeletePresetQuizCommand)
export class DeletePresetQuizHandler implements ICommandHandler<
  DeletePresetQuizCommand,
  void
> {
  constructor(
    @Inject(PRESET_QUIZ_REPOSITORY)
    private readonly repo: IPresetQuizRepository,
  ) {}

  async execute(command: DeletePresetQuizCommand): Promise<void> {
    await this.repo.delete(command.id);
  }
}
