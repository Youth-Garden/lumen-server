import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { SubmitGrammarExerciseCommand } from './submit-grammar-exercise.command';
import { GRAMMAR_EXERCISE_REPOSITORY } from '../../domain/repositories/grammar-exercise.repository.interface';
import type { IGrammarExerciseRepository } from '../../domain/repositories/grammar-exercise.repository.interface';
import { SubmitExerciseResponseDto } from '../responses/submit-exercise.response.dto';
import { AppException } from '../../../../shared/domain/exceptions/app.exception';
import { GrammarEx } from '../../domain/exceptions/grammar.exception';
import { GrammarExerciseCompletedEvent } from '../../../../shared/domain/events/grammar-exercise-completed.event';

@CommandHandler(SubmitGrammarExerciseCommand)
export class SubmitGrammarExerciseHandler implements ICommandHandler<
  SubmitGrammarExerciseCommand,
  SubmitExerciseResponseDto
> {
  constructor(
    @Inject(GRAMMAR_EXERCISE_REPOSITORY)
    private readonly repo: IGrammarExerciseRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    command: SubmitGrammarExerciseCommand,
  ): Promise<SubmitExerciseResponseDto> {
    const exercise = await this.repo.findById(command.exerciseId);
    if (!exercise) {
      throw new AppException(GrammarEx.ExerciseNotFound);
    }

    const isCorrect = exercise.validateAnswer(command.answer);

    if (isCorrect) {
      // Emit event so the Progress module can assign points!
      this.eventBus.publish(
        new GrammarExerciseCompletedEvent(
          command.userId,
          exercise.id,
          exercise.lessonId,
        ),
      );
    }

    return new SubmitExerciseResponseDto({
      isCorrect,
      correctAnswer: exercise.correctAnswer,
      explanation: exercise.explanation,
    });
  }
}
