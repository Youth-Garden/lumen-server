import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PauseExamAttemptDto {
  @ApiProperty({ description: 'Elapsed time in seconds' })
  @IsNumber()
  @IsOptional()
  elapsedSeconds: number;
}
