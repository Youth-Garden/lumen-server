export type LanguageCode = 'en' | 'vi';

export interface TranslationRecord {
  en: string;
  vi?: string;
}

export const SUPPORTED_LANGUAGES: LanguageCode[] = ['en', 'vi'];
