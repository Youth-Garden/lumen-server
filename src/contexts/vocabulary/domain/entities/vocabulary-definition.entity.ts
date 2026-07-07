import { VocabularyExample } from './vocabulary-example.entity';

export class VocabularyDefinition {
  constructor(
    public readonly id: string,
    public readonly partOfSpeech: string,
    public readonly definitionEn: string,
    public readonly translationVi: string,
    private _examples: VocabularyExample[] = [],
  ) {}

  get examples(): VocabularyExample[] {
    return this._examples;
  }

  addExample(example: VocabularyExample): void {
    this._examples.push(example);
  }
}
