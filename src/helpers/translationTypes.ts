import translations from '../assets/translations.json';
import { Language } from './enum';

export type TranslationKey = keyof typeof translations;
export type LanguageSet = Record<Language, string>;
export type AllTranslationsMap = Map<TranslationKey, LanguageSet>;

export type AllTranslationsObject = Record<TranslationKey, LanguageSet>

export type TranslationTree = {
  [key: string]: TranslationTree | string;
};