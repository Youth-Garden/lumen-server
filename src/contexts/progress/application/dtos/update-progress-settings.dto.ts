import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateProgressSettingsDto {
  @ApiProperty({ required: false, description: 'Daily goal in minutes' })
  @IsOptional()
  @IsInt()
  @Min(1)
  dailyGoalMinutes?: number;
}
