import { ExamAttempt } from '../aggregates/exam-attempt.aggregate';

export const EXAM_ATTEMPT_REPOSITORY = Symbol('EXAM_ATTEMPT_REPOSITORY');

export interface IExamAttemptRepository {
  save(attempt: ExamAttempt): Promise<void>;
  findById(id: string): Promise<ExamAttempt | null>;
  findByUserId(userId: string): Promise<ExamAttempt[]>;
  findByUserIdPaged(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ items: ExamAttempt[]; total: number }>;
}
