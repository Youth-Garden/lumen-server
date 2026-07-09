import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListListeningLessonsQuery } from './list-listening-lessons.query';
import { LISTENING_LESSON_REPOSITORY } from '../../domain/repositories/listening-lesson.repository.interface';
import type { IListeningLessonRepository } from '../../domain/repositories/listening-lesson.repository.interface';
import { ListeningLessonResponseDto } from '../responses/listening-lesson.response.dto';
import { PaginatedResponseDto } from '../../../../shared-kernel/dtos/paginated-response.dto';

@QueryHandler(ListListeningLessonsQuery)
export class ListListeningLessonsHandler implements IQueryHandler<
  ListListeningLessonsQuery,
  PaginatedResponseDto<ListeningLessonResponseDto>
> {
  constructor(
    @Inject(LISTENING_LESSON_REPOSITORY)
    private readonly repo: IListeningLessonRepository,
  ) {}

  async execute(
    query: ListListeningLessonsQuery,
  ): Promise<PaginatedResponseDto<ListeningLessonResponseDto>> {
    const result = await this.repo.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
      cefrLevel: query.cefrLevel,
    });

    const items = result.items.map(
      (lesson) => new ListeningLessonResponseDto(lesson),
    );

    return new PaginatedResponseDto(items, result.total);
  }
}
