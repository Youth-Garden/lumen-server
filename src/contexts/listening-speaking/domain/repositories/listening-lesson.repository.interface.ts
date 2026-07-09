import { ListeningLesson } from '../aggregates/listening-lesson.aggregate';
import { PaginatedResult } from '../../../../shared-kernel/interfaces/paginated-result.interface';

export const LISTENING_LESSON_REPOSITORY = Symbol(
  'LISTENING_LESSON_REPOSITORY',
);

export interface IListeningLessonRepository {
  findById(id: string): Promise<ListeningLesson | null>;
  findAll(filter: {
    search?: string;
    cefrLevel?: string;
    page: number;
    limit: number;
  }): Promise<PaginatedResult<ListeningLesson>>;
  save(lesson: ListeningLesson): Promise<void>;
}
