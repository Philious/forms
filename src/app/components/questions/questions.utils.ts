import { FormControl, FormGroup } from "@angular/forms";
import { Question, Translations } from "../../../helpers/types";
import { Language } from "../../../helpers/enum";

export type FormTranslations = FormGroup<Record<Language, FormControl<string>>>;
export type TranslationCollection = FormGroup<Record<string, FormTranslations>>

function translationsToFormGroup(translations: Translations): FormTranslations {
  const translationControls: any = {};
  for (const t in translations) {
    translationControls[t] = new FormControl(translations[t as keyof Translations])
  }
  return new FormGroup(translationControls)
}

export function toTranslationsFormGroup(questions: Question[]): TranslationCollection {
  const groupedTranslations: any = {};
  questions.forEach((question) => {
    groupedTranslations[question.id] = translationsToFormGroup(question.translations)
  });
  const q = new FormGroup(groupedTranslations);

  return q;
}