import type { I18nString } from '../../../../shared/domain/types/translation.type';

export class VocabularyExample {
  constructor(
    public readonly id: string,
    public readonly sentence: I18nString,
  ) {}
}
