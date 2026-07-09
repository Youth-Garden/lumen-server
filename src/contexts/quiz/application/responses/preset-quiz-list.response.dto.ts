import { ApiProperty } from '@nestjs/swagger';
import { PresetQuizResponseDto } from './preset-quiz.response.dto';

export class PresetQuizListResponseDto {
  @ApiProperty({ type: [PresetQuizResponseDto] })
  items: PresetQuizResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  constructor(partial: Partial<PresetQuizListResponseDto>) {
    Object.assign(this, partial);
  }
}
