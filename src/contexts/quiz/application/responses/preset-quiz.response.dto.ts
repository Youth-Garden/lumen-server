import { ApiProperty } from '@nestjs/swagger';

export class PresetQuizResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  constructor(partial: Partial<PresetQuizResponseDto>) {
    Object.assign(this, partial);
  }
}
