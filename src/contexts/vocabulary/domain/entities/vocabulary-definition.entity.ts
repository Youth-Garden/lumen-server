import { VocabularyExample } from './vocabulary-example.entity';
import { TranslationRecord } from '../../../../shared/domain/types/translation.type';

export class VocabularyDefinition {
  constructor(
    public readonly id: string,
    public readonly partOfSpeech: string,
    public readonly definition: TranslationRecord,
    private _examples: VocabularyExample[] = [],
  ) {}

  get examples(): VocabularyExample[] {
    return this._examples;
  }

  addExample(example: VocabularyExample): void {
    this._examples.push(example);
  }
}
