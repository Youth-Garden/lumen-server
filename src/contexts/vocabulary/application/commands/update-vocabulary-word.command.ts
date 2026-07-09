export class UpdateVocabularyWordCommand {
  constructor(
    public readonly wordId: string,
    public readonly term?: string,
    public readonly phonetic?: string | null,
    public readonly audioUrl?: string | null,
    public readonly cefrLevel?: string | null,
    public readonly definitions?: Array<{
      partOfSpeech: string;
      definitionEn: string;
      translationVi: string;
      examples: Array<{
        sentenceEn: string;
        translationVi: string;
      }>;
    }>,
  ) {}
}
