export interface IImageProvider {
  readonly name: string;
  isEnabled(): boolean;
  fetchImage(term: string): Promise<string | null>;
}

export interface ITranslationProvider {
  readonly name: string;
  isEnabled(): boolean;
  translate(
    text: string,
    targetLang?: string,
    sourceLang?: string,
  ): Promise<string | null>;
}

export interface EnrichedDictionaryMetadata {
  phoneticUs: string | null;
  phoneticUk: string | null;
  audioUsUrl: string | null;
  audioUkUrl: string | null;
  enDef: string | null;
  pos: string;
  enExample: string | null;
}

export interface IDictionaryProvider {
  readonly name: string;
  isEnabled(): boolean;
  fetchMetadata(
    term: string,
  ): Promise<Partial<EnrichedDictionaryMetadata> | null>;
}

export interface FullEnrichedWordResult {
  term: string;
  phoneticUs: string | null;
  phoneticUk: string | null;
  audioUsUrl: string | null;
  audioUkUrl: string | null;
  imageUrl: string | null;
  partOfSpeech: string;
  definitionEn: string;
  definitionVi: string;
  exampleEn: string | null;
  exampleVi: string | null;
}
