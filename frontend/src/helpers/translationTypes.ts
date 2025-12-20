import { FormControl, FormGroup } from '@angular/forms';
import translations from '../assets/translations.json';
import { Locale } from './enum';

export type TranslationKey = keyof typeof translations | string;
export type FormGroupKey = string;

export type LanguageImport = Record<TranslationKey, string>;
export type NamedLanguageImport = {
  [Locale.EN]: Partial<LanguageImport>;
  [Locale.NB]: Partial<LanguageImport>;
  [Locale.SV]: Partial<LanguageImport>;
};

export type LanguageSet = Record<Locale, string>;

export type AllTranslationsObject = Record<TranslationKey, LanguageSet>;

export type TranslationTree = {
  [key: string]: TranslationTree | string;
};

export type FormTranslation = Record<Locale, FormControl<string | null>>;
export type FormTranslationGroup = FormGroup<FormTranslation>;
export type TranslationCollection = Record<FormGroupKey, FormTranslationGroup>;
export type TranslationCollectionGroup = FormGroup<TranslationCollection>;

export type Translation = Record<Locale, string>;
