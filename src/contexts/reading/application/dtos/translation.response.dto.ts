import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleResponseDto {
  @ApiProperty()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export class TranslationResponseDto {
  @ApiProperty()
  translation: string;

  constructor(translation: string) {
    this.translation = translation;
  }
}
