import { ApiProperty } from '@nestjs/swagger';

export class HeatmapItemDto {
  @ApiProperty({ example: '2026-07-16' })
  date: string;

  @ApiProperty({ example: 12 })
  count: number;
}
