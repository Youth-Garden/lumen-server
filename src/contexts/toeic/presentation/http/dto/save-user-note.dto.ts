import { IsEnum, IsString, IsUUID, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserNoteCategory } from '../../../domain/entities/user-note';

export class SaveUserNoteDto {
  @ApiProperty()
  @IsUUID()
  questionId: string;

  @ApiProperty()
  @IsUUID()
  testId: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ enum: UserNoteCategory })
  @IsEnum(UserNoteCategory)
  category: UserNoteCategory;

  @ApiProperty({ type: [String], default: [] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[];
}
