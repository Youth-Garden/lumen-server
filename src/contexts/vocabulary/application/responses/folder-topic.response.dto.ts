import { ApiProperty } from '@nestjs/swagger';
import type { I18nString } from '../../../../shared/domain/types/translation.type';

export class FolderTopicResponseDto {
  @ApiProperty({
    type: Object,
    description: 'Multilingual topic title map (e.g. { en: "...", vi: "..." })',
  })
  topic: I18nString;

  @ApiProperty({ nullable: true })
  topicImageUrl: string | null;

  @ApiProperty()
  count: number;

  @ApiProperty()
  learnedCount: number;

  @ApiProperty()
  dueCount: number;
}
