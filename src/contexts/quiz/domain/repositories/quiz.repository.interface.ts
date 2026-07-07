import { PaginatedResult } from '../../../../shared-kernel/interfaces/paginated-result.interface';
import { Quiz } from '../aggregates/quiz.aggregate';

export const QUIZ_REPOSITORY = Symbol('QUIZ_REPOSITORY');

export interface IQuizRepository {
  save(quiz: Quiz): Promise<void>;
  findById(id: string): Promise<Quiz | null>;
  findByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Quiz>>;
  findByIdAndUserId(id: string, userId: string): Promise<Quiz | null>;
}
