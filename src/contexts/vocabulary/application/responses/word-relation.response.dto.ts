import { Expose } from 'class-transformer';
import { WordRelationType } from '../../infrastructure/entities/word-relation.entity';

export class WordRelationResponseDto {
  @Expose()
  id: string;

  @Expose()
  sourceWordId: string;

  @Expose()
  definitionId: string | null;

  @Expose()
  targetWordId: string | null;

  @Expose()
  targetTerm: string;

  @Expose()
  relationType: WordRelationType;

  @Expose()
  displayOrder: number;

  constructor(partial: Partial<WordRelationResponseDto>) {
    Object.assign(this, partial);
  }
}
