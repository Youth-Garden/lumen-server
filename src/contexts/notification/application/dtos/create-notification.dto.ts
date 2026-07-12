import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ description: 'Notification title', example: 'New Message' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Notification description/body',
    example: 'You have a new message.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
