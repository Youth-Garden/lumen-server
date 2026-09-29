import type { I18nString } from '../domain/types/translation.type';
import { Locale } from '../domain/types/translation.type';

export function toI18nString(input: unknown): I18nString {
  if (!input) return {};
  if (typeof input === 'object' && input !== null) {
    return input as I18nString;
  }
  if (typeof input === 'string' && input.trim()) {
    try {
      const parsed: unknown = JSON.parse(input);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as I18nString;
      }
    } catch {
      // plain string
    }
    return { [Locale.EN]: input.trim() };
  }
  return {};
}

export function i18nText(
  input: I18nString | null | undefined,
  locale: Locale = Locale.EN,
): string {
  if (!input) return '';
  switch (locale) {
    case Locale.VI:
      return input.vi || input.en || Object.values(input)[0] || '';
    case Locale.EN:
    default:
      return input.en || input.vi || Object.values(input)[0] || '';
  }
}
