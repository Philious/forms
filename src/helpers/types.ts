import { FormControl, FormGroup } from "@angular/forms";
import { IconEnum, Language } from "./enum";

export type actionButton = {
  id: string;
  label: string;
  action: () => void;
  keepOpenOnClick?: boolean;
}

export type Option = actionButton & { icon?: IconEnum; }

export type Position = {
  top: number,
  right: number,
  bottom: number,
  left: number,
  width: number,
  height: number
}

export type DefaultLanguage = { [Language.Swedish]: string }

export type Translations = DefaultLanguage & Record<Exclude<Language, Language.Swedish>, string>;

export type AdditionalText = {
  id: string;
  title?: Translations;
  text?: Translations;
}

export type Question = {
  id: string;
  translationId: string;
  translations: Translations;
  needs?: string[];
  requires?: string[];
}

export type QuestionTree = {
  [key: string]: QuestionTree | string;
};


export type Section = {
  id: string;
  title: Translations;
  questions: Question[];
}

export type Questionare = {
  id: string;
  title: Translations;
  sections: Section[];
}

export type FormTranslations = FormGroup<Record<Language, FormControl<string>>>;
export type TranslationCollection = FormGroup<Record<string, FormTranslations>>