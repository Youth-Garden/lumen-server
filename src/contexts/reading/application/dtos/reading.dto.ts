import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ description: 'The title of the article' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the article (markdown or plain text)',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
