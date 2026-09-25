import { ApiProperty } from '@nestjs/swagger';
import type { I18nString } from '../../../../shared/domain/types/translation.type';

export class NotificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: Object })
  title: I18nString;

  @ApiProperty({ type: Object })
  description: I18nString;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty()
  createdAt: Date;
}
