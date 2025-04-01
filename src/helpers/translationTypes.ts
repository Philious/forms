import { FormControl, FormGroup } from '@angular/forms';
import translations from '../assets/translations.json';
import { Language } from './enum';

export type TranslationKey = keyof typeof translations;
export type FormGroupKey = string;

export type LanguageImport = Record<TranslationKey, string>;
export type NamedLanguageImport = {
  [Language.English]: Partial<LanguageImport>
  [Language.Norwegian]: Partial<LanguageImport>
  [Language.Swedish]: Partial<LanguageImport>
}

export type LanguageSet = Record<Language, string>;

export type AllTranslationsMap = Map<TranslationKey, LanguageSet>;
export type AllTranslationsObject = Record<TranslationKey, LanguageSet>

export type TranslationTree = {
  [key: string]: TranslationTree | string;
};

export type FormTranslation = Record<Language, FormControl<string | null>>;
export type FormTranslationGroup = FormGroup<FormTranslation>;
export type TranslationCollection = Record<FormGroupKey, FormTranslationGroup>
export type TranslationCollectionGroup = FormGroup<TranslationCollection>

