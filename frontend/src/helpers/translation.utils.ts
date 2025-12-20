import { FormControl, FormGroup } from '@angular/forms';
import { Entrey, TranslationSet } from '@src/app/components/questionsTree/types';
import { Language } from './enum';
import {
  AllTranslationsObject,
  FormGroupKey,
  FormTranslation,
  FormTranslationGroup,
  NamedLanguageImport,
  TranslationCollection,
  TranslationCollectionGroup,
  TranslationKey,
  TranslationTree,
} from './translationTypes';

export function translationSetFormGroup(translations: TranslationSet): FormTranslationGroup {
  const translationControls: any = {};
  for (const t in translations) {
    translationControls[t] = new FormControl(translations[t as keyof TranslationSet]);
  }
  return new FormGroup(translationControls);
}

export function toTranslationsFormGroup(questions: Entrey[]): TranslationCollectionGroup {
  const groupedTranslations: any = {};
  questions.forEach(question => {
    groupedTranslations[question.id] = translationSetFormGroup(question.translations);
  });
  const q = new FormGroup(groupedTranslations) as TranslationCollectionGroup;

  return q;
}

export function createEmptyTranslations(): TranslationSet {
  const translationsKeys = Object.values(Language);

  return translationsKeys.reduce((prev, curr) => {
    prev[curr] = '';

    return prev;
  }, {} as TranslationSet);
}

export function toTranslationFormGroup(key: TranslationKey) {
  return key.split(/[.-]/).join('') as FormGroupKey;
}

export function allKeys(translation: NamedLanguageImport): Set<string> {
  const transSet: Set<string> = new Set<TranslationKey>();
  Object.values(translation).forEach(tr => Object.keys(tr).forEach(t => transSet.add(t)));

  return transSet;
}

export function transformAll(trans: NamedLanguageImport): TranslationCollectionGroup {
  const langs = Object.keys(trans) as (keyof NamedLanguageImport)[];
  const translationKeys = allKeys(trans);

  const form = ([...translationKeys] as TranslationKey[]).reduce((acc, key) => {
    const translation = langs.reduce((accLang, lang) => {
      const langTrans = trans[lang][key] ?? '';
      accLang[lang as Language] = new FormControl(langTrans);

      return accLang;
    }, {} as FormTranslation);

    const v = new FormGroup(translation);
    const k = key.split(/[.-]/).join('') as FormGroupKey;
    acc[k] = v;

    return acc;
  }, {} as TranslationCollection);

  return new FormGroup(form);
}

export function buildTree(allTranslations: AllTranslationsObject): TranslationTree {
  const tree: Record<string, any> = {};

  for (const key in allTranslations) {
    const parts = key.split('.'); // Split key into parts
    let currentLevel = tree;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i === parts.length - 1) {
        // If it's the last part, assign the actual value
        currentLevel[part] = { [part]: key };
      } else {
        // Ensure the current level is an object before proceeding
        if (!(part in currentLevel) || typeof currentLevel[part] === 'string') {
          currentLevel[part] = {};
        }
        currentLevel = currentLevel[part];
      }
    }
  }

  return tree;
}

export function flatt(translations: AllTranslationsObject) {
  if (!translations) {
    console.log('no translation: ', translations);
    return;
  }
  let time = 0;
  const timer = (i: number) => {
    const p = Math.round((i / 16000) * 100);
    if (p !== time) {
      console.log(`${p}%`);
    }
    time = p;
  };
  const t = Object.entries(translations).reduce(
    (acc, [path, langSet], i) => {
      timer(i);
      const entry = Object.entries(langSet).reduce(
        (acc2, [lang, trans]) => {
          const key = `${path}.${lang}`;
          return { ...acc2, [key]: trans };
        },
        {} as Record<string, string>
      );
      return { ...acc, ...entry };
    },
    {} as Record<string, string>
  );

  return t;
}

export function keyMultipleLanguages(trans: NamedLanguageImport) {
  const langs = Object.keys(trans) as (keyof NamedLanguageImport)[];
  const translationKeys = allKeys(trans);

  return ([...translationKeys] as TranslationKey[]).reduce((acc, key) => {
    const translations = langs.reduce(
      (accLang, lang) => {
        const langTrans = trans[lang][key] ?? '';
        accLang[lang as Language] = langTrans;

        return accLang;
      },
      {} as Record<Language, string>
    );

    acc[key] = translations;

    return acc;
  }, {} as AllTranslationsObject);
}

export function saveToFile(translations: any): void {
  const blob = new Blob([JSON.stringify(translations, null, 2)], {
    type: 'application/json',
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'translations.json';
  a.click();
  window.URL.revokeObjectURL(url);
}
