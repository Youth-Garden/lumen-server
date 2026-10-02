import { VocabularyExample } from './vocabulary-example.entity';
import { VocabularyWordRelation } from './vocabulary-word-relation.entity';
import type { I18nString } from '../../../../shared/domain/types/translation.type';

export class VocabularyDefinition {
  constructor(
    public readonly id: string,
    public readonly partOfSpeech: string,
    public readonly definition: I18nString,
    private _examples: VocabularyExample[] = [],
    private _relations: VocabularyWordRelation[] = [],
  ) {}

  get examples(): VocabularyExample[] {
    return this._examples;
  }

  get relations(): VocabularyWordRelation[] {
    return this._relations;
  }

  addExample(example: VocabularyExample): void {
    this._examples.push(example);
  }

  addRelation(relation: VocabularyWordRelation): void {
    this._relations.push(relation);
  }
}
