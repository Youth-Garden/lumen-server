import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import {
  AdminContentDistributionDto,
  AdminDashboardResponseDto,
  AdminUserGrowthDto,
  AdminWeeklyActivityDto,
} from '../responses/admin-dashboard.response.dto';
import { GetAdminDashboardQuery } from './get-admin-dashboard.query';

@Injectable()
@QueryHandler(GetAdminDashboardQuery)
export class GetAdminDashboardHandler implements IQueryHandler<
  GetAdminDashboardQuery,
  AdminDashboardResponseDto
> {
  constructor(private readonly dataSource: DataSource) {}

  async execute(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _query: GetAdminDashboardQuery,
  ): Promise<AdminDashboardResponseDto> {
    // Basic counts
    const usersResult: { count: string }[] = await this.dataSource.query(
      `SELECT COUNT(*) as count FROM users`,
    );
    const totalUsers = parseInt(usersResult[0]?.count || '0', 10);

    const testsCompleted = 0;

    // Mock active now since we don't have socket presence yet
    const activeNow = Math.floor(Math.random() * 50) + 10;

    const materialsResult: { count: string }[] = await this.dataSource.query(
      `SELECT SUM("viewCount") as count FROM materials`,
    );
    const materialViews = parseInt(materialsResult[0]?.count || '0', 10);

    // Generate some basic past 7 months growth (mocked logic based on totalUsers for visual)
    const userGrowth: AdminUserGrowthDto[] = [
      new AdminUserGrowthDto('Jan', Math.floor(totalUsers * 0.1)),
      new AdminUserGrowthDto('Feb', Math.floor(totalUsers * 0.2)),
      new AdminUserGrowthDto('Mar', Math.floor(totalUsers * 0.3)),
      new AdminUserGrowthDto('Apr', Math.floor(totalUsers * 0.5)),
      new AdminUserGrowthDto('May', Math.floor(totalUsers * 0.7)),
      new AdminUserGrowthDto('Jun', Math.floor(totalUsers * 0.9)),
      new AdminUserGrowthDto('Jul', totalUsers),
    ];

    const contentDistribution: AdminContentDistributionDto[] = [
      new AdminContentDistributionDto('Reading', 45, '#3b82f6'),
      new AdminContentDistributionDto('Listening', 35, '#f59e0b'),
      new AdminContentDistributionDto('Vocabulary', 20, '#10b981'),
    ];

    const weeklyActivity: AdminWeeklyActivityDto[] = [
      new AdminWeeklyActivityDto('Mon', 120, 200, 150),
      new AdminWeeklyActivityDto('Tue', 150, 220, 170),
      new AdminWeeklyActivityDto('Wed', 180, 250, 190),
      new AdminWeeklyActivityDto('Thu', 140, 280, 160),
      new AdminWeeklyActivityDto('Fri', 190, 300, 210),
      new AdminWeeklyActivityDto('Sat', 250, 350, 280),
      new AdminWeeklyActivityDto('Sun', 300, 400, 320),
    ];

    return new AdminDashboardResponseDto(
      totalUsers,
      testsCompleted,
      materialViews,
      activeNow,
      userGrowth,
      contentDistribution,
      weeklyActivity,
    );
  }
}
