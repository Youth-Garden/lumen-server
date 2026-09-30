import { UserProgress } from '../aggregates/user-progress.aggregate';

export const USER_PROGRESS_REPOSITORY = Symbol('USER_PROGRESS_REPOSITORY');

export interface IUserProgressRepository {
  save(progress: UserProgress): Promise<void>;
  findByUserAndFlashcard(
    userId: string,
    flashcardId: string,
  ): Promise<UserProgress | null>;
  findManyByUserAndFlashcards(
    userId: string,
    flashcardIds: string[],
  ): Promise<Map<string, UserProgress>>;
}
