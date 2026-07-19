import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../../../shared/presentation/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../shared/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/presentation/guards/roles.guard';
import { AdminDashboardResponseDto } from '../../application/responses/admin-dashboard.response.dto';
import { GetAdminDashboardQuery } from '../../application/queries/get-admin-dashboard.query';
import { Role } from '../../../iam/domain/enums/role.enum';

@ApiTags('Admin Dashboard')
@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard stats retrieved successfully.',
    type: AdminDashboardResponseDto,
  })
  async getDashboard(): Promise<AdminDashboardResponseDto> {
    return this.queryBus.execute<
      GetAdminDashboardQuery,
      AdminDashboardResponseDto
    >(new GetAdminDashboardQuery());
  }
}
