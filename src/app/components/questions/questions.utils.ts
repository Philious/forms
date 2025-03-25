import { FormControl, FormGroup } from "@angular/forms";
import { FormTranslations, Question, QuestionTree, TranslationCollection, Translations } from "../../../helpers/types";
import { Language } from "../../../helpers/enum";

export function translationsToFormGroup(translations: Translations): FormTranslations {
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

export function createEmptyTranslations(): Record<Language, string> {
  const translationsKeys = Object.values(Language);
  return translationsKeys.reduce((prev, curr) => {
    prev[curr] = '';
    return prev
  }, {} as Record<Language, string>);

}

export function buildTree(questions: Question[]): QuestionTree {
  const tree: Record<string, any> = {};
  const paths = questions.map(q => q.translationId);

  for (const question of questions) {
    const parts = question.translationId.split(".");
    let current = tree;

    for (let i = 0; i < parts.length; i++) {
      const key = parts[i];

      // If it's the last part, assign it as a value instead of an object
      if (i === parts.length - 1) {
        current[key] = question.id;
      } else {
        // If the key doesn't exist, create an empty object
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key]; // Move deeper into the tree
      }
    }
  }

  return tree;
}