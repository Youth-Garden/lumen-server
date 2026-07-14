import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CurrentUser } from '../../../../shared-kernel/decorators/current-user.decorator';
import { GetNotificationsQuery } from '../../application/queries/get-notifications.query';
import { MarkNotificationReadCommand } from '../../application/commands/mark-notification-read.command';
import { MarkAllNotificationsReadCommand } from '../../application/commands/mark-all-notifications-read.command';
import { CreateNotificationCommand } from '../../application/commands/create-notification.command';
import { CreateNotificationDto } from '../../application/dtos/create-notification.dto';
import { NotificationResponseDto } from '../../application/ports/notification-query.repository';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for the current user' })
  @ApiResponse({ type: [NotificationResponseDto], status: 200 })
  async getNotifications(
    @CurrentUser() userId: string,
  ): Promise<NotificationResponseDto[]> {
    return this.queryBus.execute<
      GetNotificationsQuery,
      NotificationResponseDto[]
    >(new GetNotificationsQuery(userId));
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a single notification as read' })
  @ApiParam({ name: 'id', description: 'Notification UUID' })
  @ApiResponse({ status: 200, description: 'Notification marked as read.' })
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.commandBus.execute<MarkNotificationReadCommand, void>(
      new MarkNotificationReadCommand(id, userId),
    );
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read.',
  })
  async markAllAsRead(@CurrentUser() userId: string): Promise<void> {
    await this.commandBus.execute<MarkAllNotificationsReadCommand, void>(
      new MarkAllNotificationsReadCommand(userId),
    );
  }

  @Post('debug')
  @ApiOperation({
    summary: '[DEBUG] Create a test notification for the current user',
  })
  @ApiResponse({ status: 201, description: 'Notification created.' })
  async createDebugNotification(
    @Body() dto: CreateNotificationDto,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.commandBus.execute<CreateNotificationCommand, void>(
      new CreateNotificationCommand(userId, dto.title, dto.description),
    );
  }
}
