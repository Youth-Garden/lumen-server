import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetListeningLessonDetailsQuery } from './get-listening-lesson-details.query';
import { LISTENING_LESSON_REPOSITORY } from '../../domain/repositories/listening-lesson.repository.interface';
import type { IListeningLessonRepository } from '../../domain/repositories/listening-lesson.repository.interface';
import { ListeningLessonResponseDto } from '../responses/listening-lesson.response.dto';
import { AppException } from '../../../../common/exceptions/app.exception';
import { ListeningSpeakingEx } from '../../domain/exceptions/listening-speaking.exception';

@QueryHandler(GetListeningLessonDetailsQuery)
export class GetListeningLessonDetailsHandler implements IQueryHandler<
  GetListeningLessonDetailsQuery,
  ListeningLessonResponseDto
> {
  constructor(
    @Inject(LISTENING_LESSON_REPOSITORY)
    private readonly repo: IListeningLessonRepository,
  ) {}

  async execute(
    query: GetListeningLessonDetailsQuery,
  ): Promise<ListeningLessonResponseDto> {
    const lesson = await this.repo.findById(query.id);
    if (!lesson) {
      throw new AppException(ListeningSpeakingEx.ListeningLessonNotFound);
    }
    return new ListeningLessonResponseDto(lesson);
  }
}
