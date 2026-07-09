import { PresetQuiz } from '../aggregates/preset-quiz.aggregate';

export const PRESET_QUIZ_REPOSITORY = 'PRESET_QUIZ_REPOSITORY';

export interface IPresetQuizRepository {
  save(quiz: PresetQuiz): Promise<void>;
  findById(id: string): Promise<PresetQuiz | null>;
  findAll(
    page: number,
    limit: number,
  ): Promise<{ items: PresetQuiz[]; total: number }>;
  delete(id: string): Promise<void>;
}
