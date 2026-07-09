import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListGrammarLessonExercisesQuery } from './list-grammar-lesson-exercises.query';
import { GRAMMAR_EXERCISE_REPOSITORY } from '../../domain/repositories/grammar-exercise.repository.interface';
import type { IGrammarExerciseRepository } from '../../domain/repositories/grammar-exercise.repository.interface';
import { GrammarExerciseResponseDto } from '../responses/grammar-exercise.response.dto';

@QueryHandler(ListGrammarLessonExercisesQuery)
export class ListGrammarLessonExercisesHandler implements IQueryHandler<
  ListGrammarLessonExercisesQuery,
  GrammarExerciseResponseDto[]
> {
  constructor(
    @Inject(GRAMMAR_EXERCISE_REPOSITORY)
    private readonly repo: IGrammarExerciseRepository,
  ) {}

  async execute(
    query: ListGrammarLessonExercisesQuery,
  ): Promise<GrammarExerciseResponseDto[]> {
    const exercises = await this.repo.findByLessonId(query.lessonId);
    return exercises.map(
      (exercise) => new GrammarExerciseResponseDto(exercise),
    );
  }
}
