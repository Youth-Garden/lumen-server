import { Body, Controller, Get, Put } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CurrentUser } from '../../../../shared-kernel/decorators/current-user.decorator';
import { GetDashboardQuery } from '../../application/queries/get-dashboard.query';
import { DashboardResponseDto } from '../../application/responses/dashboard.response.dto';
import { UpdateProgressSettingsDto } from '../../application/dtos/update-progress-settings.dto';
import { UpdateProgressSettingsCommand } from '../../application/commands/update-progress-settings.command';
import { GetRecentActivitiesQuery } from '../../application/queries/get-recent-activities.query';
import { ActivityResponseDto } from '../../application/responses/activity.response.dto';

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
}
