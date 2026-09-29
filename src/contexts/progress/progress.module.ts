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
import { GetDashboardHandler } from './application/queries/get-dashboard.handler';
import { GetRecentActivitiesHandler } from './application/queries/get-recent-activities.handler';
import { GetLeaderboardHandler } from './application/queries/get-leaderboard.handler';
import { GetAllBadgesHandler } from './application/queries/get-all-badges.handler';
import { GetHeatmapHandler } from './application/queries/get-heatmap.handler';
import { BuyStreakFreezeHandler } from './application/commands/buy-streak-freeze.handler';
import { UpdateProgressSettingsHandler } from './application/commands/update-progress-settings.handler';
import { ProgressController } from './presentation/http/progress.controller';

import { DailyGoalHistoryEntity } from './infrastructure/entities/daily-goal-history.entity';

const EventHandlers = [FlashcardReviewedListener];
const QueryHandlers = [
  GetDashboardHandler,
  GetRecentActivitiesHandler,
  GetLeaderboardHandler,
  GetAllBadgesHandler,
  GetHeatmapHandler,
];
const CommandHandlers = [UpdateProgressSettingsHandler, BuyStreakFreezeHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      LearningProfileEntity,
      ActivityEntity,
      BadgeEntity,
      DailyGoalHistoryEntity,
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
