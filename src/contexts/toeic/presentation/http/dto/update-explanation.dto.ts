import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateExplanationDto {
  @ApiProperty()
  @IsString()
  explanation: string;

  @ApiProperty({ type: [String], default: [] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mediaUrls: string[];
}
