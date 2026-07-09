import { ApiProperty } from '@nestjs/swagger';
import { MaterialType, MaterialLevel } from '../../domain/enums/material.enum';

export class TranscriptDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  sequenceNumber: number;

  @ApiProperty()
  text: string;

  @ApiProperty({ required: false })
  translation?: string;

  @ApiProperty({ required: false })
  startTime?: number;

  @ApiProperty({ required: false })
  endTime?: number;
}

export class MaterialDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: MaterialType })
  type: MaterialType;

  @ApiProperty({ required: false })
  mediaUrl?: string;

  @ApiProperty({ required: false })
  thumbnailUrl?: string;

  @ApiProperty({ enum: MaterialLevel, required: false })
  level?: MaterialLevel;

  @ApiProperty({ type: [String], required: false })
  tags?: string[];

  @ApiProperty({ required: false })
  duration?: number;

  @ApiProperty({ type: [TranscriptDto] })
  transcripts: TranscriptDto[];
}

export class MaterialListDto {
  @ApiProperty({ type: [MaterialDto] })
  items: Omit<MaterialDto, 'transcripts'>[];

  @ApiProperty()
  total: number;
}
