import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateDeckDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string | null;
}

export class CreateFlashcardDto {
  @IsUUID()
  @IsNotEmpty()
  deckId: string;

  @IsUUID()
  @IsNotEmpty()
  wordId: string;
}
