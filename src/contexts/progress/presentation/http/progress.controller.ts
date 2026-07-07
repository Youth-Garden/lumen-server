import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { CurrentUser } from '../../../../shared-kernel/decorators/current-user.decorator';
import { GetDashboardQuery } from '../../application/queries/get-dashboard.query';
import { DashboardResponseDto } from '../../application/dto/dashboard.response.dto';

@ApiTags('Progress')
@ApiBearerAuth()
@Controller('progress')
export class ProgressController {
  constructor(private readonly queryBus: QueryBus) {}

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
}
