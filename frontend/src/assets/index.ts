import { InjectionToken } from '@angular/core';

import enUSJson from './enUS.json';
import nbNOJson from './nbNO.json';
import svSEJson from './svSE.json';

export type TranslationKeys = keyof typeof svSEJson | keyof typeof enUSJson | keyof typeof nbNOJson;
export type TranslationKeysNullable = TranslationKeys | null;

export enum TranslationLocale {
  /* eslint-disable @typescript-eslint/naming-convention */
  SV_SE = 'sv-SE',
  EN_US = 'en-US',
  NB_NO = 'nb-NO',
  SHOW_TRANSLATION_KEYS = 'showTranslationKeys' // this is for the Admin Console (shows translations keys instead of translated value)
  /* eslint-enable @typescript-eslint/naming-convention */
}

export type TranslationLocaleType = Exclude<
  TranslationLocale,
  TranslationLocale.SHOW_TRANSLATION_KEYS
>;

export const TRANSLATION_LOCALES_TOKEN = new InjectionToken<TranslationLocale>('Available locales');

export const translationLocalesProvider = {
  provide: TRANSLATION_LOCALES_TOKEN,
  useValue: TranslationLocale
};

export type Translation = Record<string, string>;

export type Translations = Record<TranslationLocale, Translation>;

const translations: Translations = {
  /* eslint-disable @typescript-eslint/naming-convention */
  'sv-SE': svSEJson,
  'en-US': enUSJson,
  'nb-NO': nbNOJson,
  showTranslationKeys: {}
  /* eslint-enable @typescript-eslint/naming-convention */
};

export const TRANSLATIONS_TOKEN = new InjectionToken<Translations>('Translations');

export const translationsProvider = {
  provide: TRANSLATIONS_TOKEN,
  useValue: translations
};

export const defaultTranslationLocale: TranslationLocale = TranslationLocale.SV_SE;

export const DEFAULT_TRANSLATION_LOCALE_TOKEN = new InjectionToken<TranslationLocale>(
  'Default translation locale'
);

export const defaultTranslationLocaleProvider = {
  provide: DEFAULT_TRANSLATION_LOCALE_TOKEN,
  useValue: defaultTranslationLocale
};
