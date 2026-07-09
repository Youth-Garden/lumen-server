import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AddGrammarExerciseCommand } from './add-grammar-exercise.command';
import { GRAMMAR_EXERCISE_REPOSITORY } from '../../domain/repositories/grammar-exercise.repository.interface';
import type { IGrammarExerciseRepository } from '../../domain/repositories/grammar-exercise.repository.interface';
import { GrammarExercise } from '../../domain/aggregates/grammar-exercise.aggregate';
// We should ideally check if the lesson exists before adding, but since topics handle lessons,
// for simplicity we'll just save the exercise directly. In a real scenario we might need a Domain Service or query to verify the lessonId.

@CommandHandler(AddGrammarExerciseCommand)
export class AddGrammarExerciseHandler implements ICommandHandler<
  AddGrammarExerciseCommand,
  string
> {
  constructor(
    @Inject(GRAMMAR_EXERCISE_REPOSITORY)
    private readonly repo: IGrammarExerciseRepository,
  ) {}

  async execute(command: AddGrammarExerciseCommand): Promise<string> {
    const exercise = GrammarExercise.create(
      uuidv4(),
      command.lessonId,
      command.questionText,
      command.options,
      command.correctAnswer,
      command.explanation,
    );

    await this.repo.save(exercise);
    return exercise.id;
  }
}
