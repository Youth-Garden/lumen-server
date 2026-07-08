import { ToeicTest } from '../entities/toeic-test';

export const TOEIC_TEST_REPOSITORY = Symbol('TOEIC_TEST_REPOSITORY');

export interface IToeicTestRepository {
  findAll(
    page: number,
    limit: number,
  ): Promise<{ items: ToeicTest[]; total: number }>;
  findById(id: string): Promise<ToeicTest | null>;
}
