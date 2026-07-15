import { SpeakingTask } from '../aggregates/speaking-task.aggregate';
import { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface';

export const SPEAKING_TASK_REPOSITORY = Symbol('SPEAKING_TASK_REPOSITORY');

export interface ISpeakingTaskRepository {
  findById(id: string): Promise<SpeakingTask | null>;
  findAll(filter: {
    search?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedResult<SpeakingTask>>;
  save(task: SpeakingTask): Promise<void>;
}
