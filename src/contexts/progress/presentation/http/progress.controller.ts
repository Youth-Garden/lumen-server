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
import { DashboardResponseDto } from '../../application/dto/dashboard.response.dto';
import { UpdateProgressSettingsDto } from '../../application/dto/update-progress-settings.dto';
import { UpdateProgressSettingsCommand } from '../../application/commands/update-progress-settings.command';

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
