import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class GrammarLessonResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  orderIndex: number;

  constructor(partial: Partial<GrammarLessonResponseDto>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class GrammarTopicResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  cefrLevel: string;

  @Expose()
  category: string | null;

  @Expose()
  @Type(() => GrammarLessonResponseDto)
  lessons?: GrammarLessonResponseDto[];

  constructor(partial: Partial<GrammarTopicResponseDto>) {
    Object.assign(this, partial);
  }
}
