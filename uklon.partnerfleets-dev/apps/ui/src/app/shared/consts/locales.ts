import { Language, Locale, RegionLocaleSettingsDto } from '@data-access';

export const LANGUAGE_LOCALE_MAP = new Map<Language, Locale>([
  [Language.EN, Locale.EN],
  [Language.UK, Locale.UK],
  [Language.UZ, Locale.UZ],
  [Language.RU, Locale.RU],
]);

export const languageToLocale = (language: string): string => {
  return LANGUAGE_LOCALE_MAP.get(language as Language) ?? `${language.charAt(0).toUpperCase()}${language.slice(1)}`;
};

export const DEFAULT_LANGUAGE_REGION_SETTINGS: RegionLocaleSettingsDto = {
  allowed: [Language.UK, Language.EN, Language.UZ, Language.RU],
  default: Language.EN,
} as const;
