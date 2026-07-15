import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningProfileEntity } from './infrastructure/entities/learning-profile.entity';
import { LearningProfileRepository } from './infrastructure/repositories/learning-profile.repository';
import { LEARNING_PROFILE_REPOSITORY } from './domain/repositories/learning-profile.repository.interface';
import { ActivityEntity } from './infrastructure/entities/activity.entity';
import { BadgeEntity } from './infrastructure/entities/badge.entity';
import { ActivityRepository } from './infrastructure/repositories/activity.repository';
import { ACTIVITY_REPOSITORY } from './domain/repositories/activity.repository.interface';
import { FlashcardReviewedListener } from './application/event-handlers/flashcard-reviewed.listener';
import { QuizCompletedListener } from './application/event-handlers/quiz-completed.listener';
import { GrammarExerciseCompletedListener } from './application/event-handlers/grammar-exercise-completed.listener';
import { SpeakingTaskCompletedListener } from './application/event-handlers/speaking-task-completed.listener';
import { ExamAttemptCompletedListener } from './application/event-handlers/exam-attempt-completed.listener';
import { GetDashboardHandler } from './application/queries/get-dashboard.handler';
import { GetRecentActivitiesHandler } from './application/queries/get-recent-activities.handler';
import { GetLeaderboardHandler } from './application/queries/get-leaderboard.handler';
import { GetAllBadgesHandler } from './application/queries/get-all-badges.handler';
import { UpdateProgressSettingsHandler } from './application/commands/update-progress-settings.handler';
import { ProgressController } from './presentation/http/progress.controller';

const EventHandlers = [
  FlashcardReviewedListener,
  QuizCompletedListener,
  GrammarExerciseCompletedListener,
  SpeakingTaskCompletedListener,
  ExamAttemptCompletedListener,
];
const QueryHandlers = [
  GetDashboardHandler,
  GetRecentActivitiesHandler,
  GetLeaderboardHandler,
  GetAllBadgesHandler,
];
const CommandHandlers = [UpdateProgressSettingsHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      LearningProfileEntity,
      ActivityEntity,
      BadgeEntity,
    ]),
  ],
  controllers: [ProgressController],
  providers: [
    ...EventHandlers,
    ...QueryHandlers,
    ...CommandHandlers,
    {
      provide: LEARNING_PROFILE_REPOSITORY,
      useClass: LearningProfileRepository,
    },
    {
      provide: ACTIVITY_REPOSITORY,
      useClass: ActivityRepository,
    },
  ],
})
export class ProgressModule {}
