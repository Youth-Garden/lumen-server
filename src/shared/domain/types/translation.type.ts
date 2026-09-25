export enum Locale {
  EN = 'en',
  VI = 'vi',
}

export type I18nString = Partial<Record<Locale, string>> &
  Record<string, string>;
