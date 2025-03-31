import { FormControl, FormGroup } from "@angular/forms";
import { Language } from "../../../helpers/enum";
import svJson from '../../../assets/svSE.json';

export type TranslationKey = keyof typeof svJson
export type TransKey = string;

export type LanguageImport = Record<TranslationKey, string>;
export type NamedLanguageImport = {
  [Language.English]: Partial<LanguageImport>
  [Language.Norwegian]: Partial<LanguageImport>
  [Language.Swedish]: LanguageImport
}

export type TranslationSet = Record<Language, string>;
export type TranslationKeyObject = Record<TransKey, TranslationSet>;

export type TranslationTree = {
  [key: string]: TranslationTree | string;
};

export type AdditionalText = {
  id: string;
  title?: TranslationSet;
  text?: TranslationSet;
}

export type Entrey = {
  id: string;
  translationPath: string;
  translations: TranslationSet;
  additional?: AdditionalText;
  needs?: string[];
  requires?: string[];
}



export type FormTranslation = Record<Language, FormControl<string | null>>;
export type FormTranslationGroup = FormGroup<FormTranslation>;
export type TranslationCollection = Record<string, FormTranslationGroup>
export type TranslationCollectionGroup = FormGroup<TranslationCollection>