import { FormControl, FormGroup } from "@angular/forms";
import { Language } from "../../../helpers/enum";
import svJson from '../../../assets/svSE.json';



export type TranslationSet = Record<Language, string>;

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



