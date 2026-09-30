import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../../../../shared/presentation/dtos/paginated-response.dto';
import type { I18nString } from '../../../../shared/domain/types/translation.type';
import { MaterialLevel, MaterialType } from '../../domain/enums/material.enum';

export class TranscriptDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  sequenceNumber: number;

  @ApiProperty({ type: Object })
  text: I18nString;

  @ApiProperty({ required: false })
  startTime?: number;

  @ApiProperty({ required: false })
  endTime?: number;
}

export class MaterialDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: Object })
  title: I18nString;

  @ApiProperty({ required: false, type: Object })
  description?: I18nString | null;

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

  @ApiProperty({ required: false })
  viewCount?: number;
}

export class MaterialListDto extends PaginatedResponseDto<
  Omit<MaterialDto, 'transcripts'>
> {}
