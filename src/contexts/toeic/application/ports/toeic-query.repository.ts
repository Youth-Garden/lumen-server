import { ToeicTestResponseDto } from '../responses/toeic-test.response.dto';

export const TOEIC_QUERY_REPOSITORY = Symbol('TOEIC_QUERY_REPOSITORY');

export interface IToeicQueryRepository {
  findPublishedTests(): Promise<ToeicTestResponseDto[]>;
  findPublishedTestById(id: string): Promise<ToeicTestResponseDto | null>;
}
