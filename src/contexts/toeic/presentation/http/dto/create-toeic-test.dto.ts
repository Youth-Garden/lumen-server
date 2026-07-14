import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateToeicTestDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
