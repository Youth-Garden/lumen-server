import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningProfileEntity } from './infrastructure/typeorm/entities/learning-profile.entity';
import { LearningProfileRepository } from './infrastructure/typeorm/repositories/learning-profile.repository';
import { LEARNING_PROFILE_REPOSITORY } from './domain/repositories/learning-profile.repository.interface';
import { FlashcardReviewedListener } from './application/event-handlers/flashcard-reviewed.listener';
import { QuizCompletedListener } from './application/event-handlers/quiz-completed.listener';
import { GrammarExerciseCompletedListener } from './application/event-handlers/grammar-exercise-completed.listener';
import { GetDashboardHandler } from './application/queries/get-dashboard.handler';
import { UpdateProgressSettingsHandler } from './application/commands/update-progress-settings.handler';
import { ProgressController } from './presentation/http/progress.controller';

const EventHandlers = [
  FlashcardReviewedListener,
  QuizCompletedListener,
  GrammarExerciseCompletedListener,
];
const QueryHandlers = [GetDashboardHandler];
const CommandHandlers = [UpdateProgressSettingsHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([LearningProfileEntity])],
  controllers: [ProgressController],
  providers: [
    ...EventHandlers,
    ...QueryHandlers,
    ...CommandHandlers,
    {
      provide: LEARNING_PROFILE_REPOSITORY,
      useClass: LearningProfileRepository,
    },
  ],
})
export class ProgressModule {}
