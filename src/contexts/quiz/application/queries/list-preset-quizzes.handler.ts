import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListPresetQuizzesQuery } from './list-preset-quizzes.query';
import { PresetQuizListResponseDto } from '../responses/preset-quiz-list.response.dto';
import { PresetQuizResponseDto } from '../responses/preset-quiz.response.dto';
import type { IPresetQuizRepository } from '../../domain/repositories/preset-quiz.repository.interface';
import { PRESET_QUIZ_REPOSITORY } from '../../domain/repositories/preset-quiz.repository.interface';

@QueryHandler(ListPresetQuizzesQuery)
export class ListPresetQuizzesHandler implements IQueryHandler<
  ListPresetQuizzesQuery,
  PresetQuizListResponseDto
> {
  constructor(
    @Inject(PRESET_QUIZ_REPOSITORY)
    private readonly repo: IPresetQuizRepository,
  ) {}

  async execute(
    query: ListPresetQuizzesQuery,
  ): Promise<PresetQuizListResponseDto> {
    const { page, limit } = query;
    const { items, total } = await this.repo.findAll(page, limit);

    const mappedItems = items.map(
      (quiz) =>
        new PresetQuizResponseDto({
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          isPublished: quiz.isPublished,
          createdAt: quiz.createdAt.toISOString(),
          updatedAt: quiz.updatedAt.toISOString(),
        }),
    );

    return new PresetQuizListResponseDto(mappedItems, total, page, limit);
  }
}
