import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetPresetQuizByIdQuery } from './get-preset-quiz-by-id.query';
import { PresetQuizResponseDto } from '../responses/preset-quiz.response.dto';
import type { IPresetQuizRepository } from '../../domain/repositories/preset-quiz.repository.interface';
import { PRESET_QUIZ_REPOSITORY } from '../../domain/repositories/preset-quiz.repository.interface';

@QueryHandler(GetPresetQuizByIdQuery)
export class GetPresetQuizByIdHandler implements IQueryHandler<
  GetPresetQuizByIdQuery,
  PresetQuizResponseDto
> {
  constructor(
    @Inject(PRESET_QUIZ_REPOSITORY)
    private readonly repo: IPresetQuizRepository,
  ) {}

  async execute(query: GetPresetQuizByIdQuery): Promise<PresetQuizResponseDto> {
    const quiz = await this.repo.findById(query.id);
    if (!quiz) {
      throw new NotFoundException('Preset quiz not found');
    }

    return new PresetQuizResponseDto({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      isPublished: quiz.isPublished,
      createdAt: quiz.createdAt.toISOString(),
      updatedAt: quiz.updatedAt.toISOString(),
    });
  }
}
