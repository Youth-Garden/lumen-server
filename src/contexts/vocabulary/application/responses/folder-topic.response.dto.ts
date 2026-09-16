import { ApiProperty } from '@nestjs/swagger';

export class FolderTopicResponseDto {
  @ApiProperty()
  topic: string;

  @ApiProperty({ nullable: true })
  topicVi: string | null;

  @ApiProperty({ nullable: true })
  topicImageUrl: string | null;

  @ApiProperty()
  count: number;

  @ApiProperty()
  learnedCount: number;

  @ApiProperty()
  dueCount: number;
}
