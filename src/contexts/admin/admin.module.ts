import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminController } from './presentation/http/admin.controller';
import { GetAdminDashboardHandler } from './application/queries/get-admin-dashboard.handler';

const QueryHandlers = [GetAdminDashboardHandler];

@Module({
  imports: [CqrsModule],
  controllers: [AdminController],
  providers: [...QueryHandlers],
})
export class AdminModule {}
