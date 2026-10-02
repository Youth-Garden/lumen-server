import { WordRelationType } from '../../infrastructure/entities/word-relation.entity';

export class VocabularyWordRelation {
  constructor(
    public readonly id: string,
    public readonly sourceWordId: string,
    public readonly definitionId: string | null,
    public readonly targetWordId: string | null,
    public readonly targetTerm: string,
    public readonly relationType: WordRelationType,
    public readonly displayOrder: number = 0,
  ) {}
}
