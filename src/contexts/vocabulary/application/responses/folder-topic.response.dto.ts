import { ApiProperty } from '@nestjs/swagger';
import type { I18nString } from '../../../../shared/domain/types/translation.type';

export class FolderTopicResponseDto {
  @ApiProperty({ description: 'Authentic UUID Primary Key of the Topic' })
  id: string;

  @ApiProperty({ required: false })
  folderId?: string;

  @ApiProperty({
    type: Object,
    required: false,
    description: 'Multilingual folder name map (e.g. { en: "...", vi: "..." })',
  })
  folderName?: I18nString;

  @ApiProperty({
    type: Object,
    description: 'Multilingual topic title map (e.g. { en: "...", vi: "..." })',
  })
  name: I18nString;

  @ApiProperty({
    type: Object,
    description: 'Alias to name for multilingual topic title',
  })
  topic: I18nString;

  @ApiProperty({ nullable: true })
  imageUrl: string | null;

  @ApiProperty({ nullable: true })
  topicImageUrl: string | null;

  @ApiProperty()
  orderIndex: number;

  @ApiProperty()
  count: number;

  @ApiProperty()
  learnedCount: number;

  @ApiProperty()
  dueCount: number;
}
