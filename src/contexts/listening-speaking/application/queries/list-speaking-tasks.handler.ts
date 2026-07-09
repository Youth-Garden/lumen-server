import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListSpeakingTasksQuery } from './list-speaking-tasks.query';
import { SPEAKING_TASK_REPOSITORY } from '../../domain/repositories/speaking-task.repository.interface';
import type { ISpeakingTaskRepository } from '../../domain/repositories/speaking-task.repository.interface';
import { SpeakingTaskResponseDto } from '../responses/speaking-task.response.dto';
import { PaginatedResponseDto } from '../../../../shared-kernel/dtos/paginated-response.dto';

@QueryHandler(ListSpeakingTasksQuery)
export class ListSpeakingTasksHandler implements IQueryHandler<
  ListSpeakingTasksQuery,
  PaginatedResponseDto<SpeakingTaskResponseDto>
> {
  constructor(
    @Inject(SPEAKING_TASK_REPOSITORY)
    private readonly repo: ISpeakingTaskRepository,
  ) {}

  async execute(
    query: ListSpeakingTasksQuery,
  ): Promise<PaginatedResponseDto<SpeakingTaskResponseDto>> {
    const result = await this.repo.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
    });

    const items = result.items.map((task) => new SpeakingTaskResponseDto(task));

    return new PaginatedResponseDto(items, result.total);
  }
}
