export type LanguageCode = 'en' | 'vi' | 'ja';

export interface TranslationRecord {
  en: string;
  vi?: string;
  ja?: string;
}

export const SUPPORTED_LANGUAGES: LanguageCode[] = ['en', 'vi', 'ja'];
