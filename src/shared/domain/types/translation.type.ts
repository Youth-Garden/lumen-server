export type SupportedLocale = 'en' | 'vi';
export type LanguageCode = SupportedLocale;

export type I18nMap = Partial<Record<SupportedLocale, string>>;
export type I18nString = I18nMap | string;

export interface TranslationRecord {
  en: string;
  vi?: string;
}

export const SUPPORTED_LANGUAGES: SupportedLocale[] = ['en', 'vi'];
