import { LearningProfile } from '../aggregates/learning-profile.aggregate';

export const LEARNING_PROFILE_REPOSITORY = Symbol(
  'LEARNING_PROFILE_REPOSITORY',
);

export interface ILearningProfileRepository {
  findByUserId(userId: string): Promise<LearningProfile | null>;
  save(profile: LearningProfile): Promise<LearningProfile>;
}
