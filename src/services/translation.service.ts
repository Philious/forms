import { computed, inject, Injectable, signal } from '@angular/core';
import enJson from '../assets/enUS.json';
import noJson from '../assets/nbNO.json';
import svJson from '../assets/svSE.json';
import { Language } from '../helpers/enum';
import { Entrey } from '../app/components/questions/types';
import { allKeys, transformAll, buildTree, toTranslationFormGroup, translationSetFormGroup } from '../helpers/translation.utils';
import { AllTranslationsObject, FormGroupKey, FormTranslationGroup, LanguageSet, NamedLanguageImport, TranslationCollectionGroup, TranslationKey, TranslationTree } from '../helpers/translationTypes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private _http = inject(HttpClient);
  private _loading = signal<boolean>(false)
  loading = computed(() => this._loading())
  translations: NamedLanguageImport = {
    [Language.English]: enJson,
    [Language.Norwegian]: noJson,
    [Language.Swedish]: svJson
  }

  private _allTranslations = signal<Record<TranslationKey, LanguageSet>>({});
  allTranslations = computed(() => {
    console.log('update all translations')
    return this._allTranslations();
  });
  private visibleTranslations = signal<AllTranslationsObject[]>([]);

  private _entries = signal<Set<string>>(allKeys(this.translations));
  entries = computed(() => this._entries());

  private _currentLanguage = signal<Language>(Language.Swedish);
  currentLanguage = computed(() => this._currentLanguage);

  private _openTranslations = signal<Set<string>>(new Set());
  openTranslations = computed(() => this._openTranslations);

  translationTree = computed<TranslationTree | null>(() => {
    console.log('update tree');
    return buildTree(this.allTranslations())
  })

  translationFormGroup = transformAll(this.translations);

  constructor() {
    this.loadTranslations();
  }

  loadTranslations(): void {
    this._loading.set(true);
    this._http.get<AllTranslationsObject>('../assets/translations.json').subscribe((data) => {
      this._allTranslations.set(data);
      this._loading.set(false);
      console.log('data', data);
      console.log('tree', this.translationTree())
    });
  }

  setLanguage(lang: Language) {
    this._currentLanguage.set(lang);
  }
  filteredQuestions(filterString: string) {
    return [...this.entries()].filter(q => q.includes(filterString))
  }
  getLanguageFormGroup(id: TranslationKey): FormTranslationGroup {
    const fromKey = toTranslationFormGroup(id);
    const formGroup = this.translationFormGroup.controls[fromKey]
    if (!formGroup) throw console.log(`No formgroup with id: ${id}`)

    return formGroup as FormTranslationGroup
  }

  addEntry(path: string, langSet: LanguageSet): void {
    console.log(langSet);
    const key = path.split(/[.-]/).join('') as FormGroupKey;
    this.translationFormGroup.addControl(key, translationSetFormGroup(langSet))
    this._allTranslations.update(obj => ({ ...obj, [path]: langSet }));
  }

  updateEntry(updatedQuestion: Entrey): void {

  }

  deleteEntry(id: string): void {

  }

  getQuestions(id: string) {

  }

  openTranslation(id: string) { this._openTranslations().add(id) }
  removeTranslation(id: string) { this._openTranslations().delete(id) }
  toggleTranslation(id: string) {
    this._openTranslations().has(id) ? this.removeTranslation(id) : this.openTranslation(id)
  }
}
