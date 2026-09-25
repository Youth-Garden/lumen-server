import { VocabularyExample } from './vocabulary-example.entity';
import type { I18nString } from '../../../../shared/domain/types/translation.type';

export class VocabularyDefinition {
  constructor(
    public readonly id: string,
    public readonly partOfSpeech: string,
    public readonly definition: I18nString,
    private _examples: VocabularyExample[] = [],
  ) {}

  get examples(): VocabularyExample[] {
    return this._examples;
  }

  addExample(example: VocabularyExample): void {
    this._examples.push(example);
  }
}
