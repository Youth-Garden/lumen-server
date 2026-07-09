import { GrammarExercise } from '../aggregates/grammar-exercise.aggregate';

export const GRAMMAR_EXERCISE_REPOSITORY = Symbol(
  'GRAMMAR_EXERCISE_REPOSITORY',
);

export interface IGrammarExerciseRepository {
  save(exercise: GrammarExercise): Promise<void>;
  findById(id: string): Promise<GrammarExercise | null>;
  findByLessonId(lessonId: string): Promise<GrammarExercise[]>;
}
