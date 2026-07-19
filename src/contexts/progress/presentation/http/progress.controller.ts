import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { BuyStreakFreezeCommand } from '../../application/commands/buy-streak-freeze.command';
import { UpdateProgressSettingsCommand } from '../../application/commands/update-progress-settings.command';
import { UpdateProgressSettingsDto } from '../../application/dtos/update-progress-settings.dto';
import { GetAllBadgesQuery } from '../../application/queries/get-all-badges.query';
import { GetDashboardQuery } from '../../application/queries/get-dashboard.query';
import { GetHeatmapQuery } from '../../application/queries/get-heatmap.query';
import { GetLeaderboardQuery } from '../../application/queries/get-leaderboard.query';
import { GetRecentActivitiesQuery } from '../../application/queries/get-recent-activities.query';
import { ActivityResponseDto } from '../../application/responses/activity.response.dto';
import { BadgeResponseDto } from '../../application/responses/badge.response.dto';
import { DashboardResponseDto } from '../../application/responses/dashboard.response.dto';
import { HeatmapItemDto } from '../../application/responses/heatmap.response.dto';
import { LeaderboardResponseDto } from '../../application/responses/leaderboard.response.dto';
import { LeaderboardPeriodEnum } from '../../domain/enums/progress.enum';

@ApiTags('Progress')
@ApiBearerAuth()
@Controller('progress')
export class ProgressController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get user dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard stats retrieved successfully.',
    type: DashboardResponseDto,
  })
  async getDashboard(
    @CurrentUser() userId: string,
  ): Promise<DashboardResponseDto> {
    return this.queryBus.execute<GetDashboardQuery, DashboardResponseDto>(
      new GetDashboardQuery(userId),
    );
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get global leaderboard' })
  @ApiQuery({ name: 'period', required: false, enum: LeaderboardPeriodEnum })
  @ApiResponse({
    status: 200,
    description: 'Leaderboard retrieved successfully.',
    type: LeaderboardResponseDto,
  })
  async getLeaderboard(
    @CurrentUser() userId: string,
    @Query('period') period?: LeaderboardPeriodEnum,
  ): Promise<LeaderboardResponseDto> {
    return this.queryBus.execute<GetLeaderboardQuery, LeaderboardResponseDto>(
      new GetLeaderboardQuery(
        50,
        period || LeaderboardPeriodEnum.ALL_TIME,
        userId,
      ),
    );
  }

  @Get('badges')
  @ApiOperation({ summary: 'Get all available badges' })
  @ApiResponse({
    status: 200,
    description: 'Badges retrieved successfully.',
    type: [BadgeResponseDto],
  })
  async getBadges(): Promise<BadgeResponseDto[]> {
    return this.queryBus.execute<GetAllBadgesQuery, BadgeResponseDto[]>(
      new GetAllBadgesQuery(),
    );
  }

  @Get('heatmap')
  @ApiOperation({ summary: 'Get user activity heatmap' })
  @ApiResponse({
    status: 200,
    description: 'Heatmap data retrieved successfully.',
    type: [HeatmapItemDto],
  })
  async getHeatmap(@CurrentUser() userId: string): Promise<HeatmapItemDto[]> {
    return this.queryBus.execute<GetHeatmapQuery, HeatmapItemDto[]>(
      new GetHeatmapQuery(userId, 365),
    );
  }

  @Get('activities')
  @ApiOperation({ summary: 'Get recent activities for user' })
  @ApiResponse({
    status: 200,
    description: 'Activities retrieved successfully.',
    type: [ActivityResponseDto],
  })
  async getActivities(
    @CurrentUser() userId: string,
  ): Promise<ActivityResponseDto[]> {
    return this.queryBus.execute<
      GetRecentActivitiesQuery,
      ActivityResponseDto[]
    >(new GetRecentActivitiesQuery(userId, 10));
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update progress settings' })
  @ApiBody({ type: UpdateProgressSettingsDto })
  @ApiResponse({
    status: 200,
    description: 'Progress settings updated successfully.',
  })
  async updateSettings(
    @CurrentUser() userId: string,
    @Body() dto: UpdateProgressSettingsDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateProgressSettingsCommand(userId, dto.dailyGoalMinutes),
    );
  }

  @Post('streak-freeze')
  @ApiOperation({ summary: 'Buy a streak freeze with 500 XP points' })
  @ApiResponse({
    status: 200,
    description: 'Streak freeze purchased successfully.',
  })
  async buyStreakFreeze(@CurrentUser() userId: string): Promise<void> {
    await this.commandBus.execute(new BuyStreakFreezeCommand(userId));
  }
}
