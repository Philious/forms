import { computed, inject, Injectable, signal } from '@angular/core';
import enJson from '../assets/enUS.json';
import noJson from '../assets/nbNO.json';
import svJson from '../assets/svSE.json';
import { Language } from '../helpers/enum';
import { Entrey, FormTranslationGroup, TranslationCollectionGroup } from '../app/components/questions/types';
import { allKeys, transformAll, buildTree, keyMultipleLanguages, saveToFile } from '../helpers/translation.utils';
import { AllTranslationsObject, LanguageSet, TranslationKey, TranslationTree } from '../helpers/translationTypes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private _http = inject(HttpClient);
  private _loading = signal<boolean>(false)
  loading = computed(() => this._loading())
  translations = {
    [Language.English]: enJson,
    [Language.Norwegian]: noJson,
    [Language.Swedish]: svJson
  }

  private allTranslations = new Map<TranslationKey, LanguageSet>();
  private visibleTranslations = signal<AllTranslationsObject[]>([]);

  private _entries = signal<Set<string>>(allKeys(this.translations));
  entries = computed(() => this._entries());

  private _currentLanguage = signal<Language>(Language.Swedish);
  currentLanguage = computed(() => this._currentLanguage);

  private _openTranslations = signal<Set<string>>(new Set());
  openTranslations = computed(() => this._openTranslations);

  private _translatrionTree = signal<TranslationTree | null>(null)
  translationTree = computed<TranslationTree | null>(() => this._translatrionTree())

  translationFormGroup = transformAll(this.translations);

  constructor() {
    this.loadTranslations();
    this._translatrionTree.set(buildTree(this.allTranslations))
  }
  t = 0;
  afterLoad() {
    console.log('running')
    if (this.allTranslations.size) {
      const tree = buildTree(this.allTranslations);
      this._translatrionTree.set(tree);
      this._loading.set(false);
    } else setTimeout(() => {
      console.log(this.t);
      this.t++;
      this.afterLoad()
    }, 100)
  }

  loadTranslations(): void {
    this._loading.set(true);
    this._http.get<AllTranslationsObject>('../assets/translations.json').subscribe((data) => {
      this.allTranslations.clear();
      console.log('data', data)
      Object.entries(data).forEach(([key, value]) => this.allTranslations.set(key as TranslationKey, value));
      this.afterLoad();
    });

  }

  setLanguage(lang: Language) {
    this._currentLanguage.set(lang);
  }
  filteredQuestions(filterString: string) {
    return [...this.entries()].filter(q => q.includes(filterString))
  }
  getLanguageFormGroup(id: string): FormTranslationGroup {
    console.log(id, this.translationFormGroup);
    const translationKey = id as keyof TranslationCollectionGroup;
    const formGroup = this.translationFormGroup[translationKey]
    if (!formGroup) throw console.log(`No formgroup with id: ${id}`)
    return formGroup as FormTranslationGroup
  }

  addQuestion(group: TranslationCollectionGroup): void {
    console.log(group);
  }

  updateQuestion(updatedQuestion: Entrey): void {

  }

  deleteQuestion(id: string): void {

  }

  getQuestions(id: string) {

  }

  openTranslation(id: string) { this._openTranslations().add(id) }
  removeTranslation(id: string) { this._openTranslations().delete(id) }
  toggleTranslation(id: string) {
    this._openTranslations().has(id) ? this.removeTranslation(id) : this.openTranslation(id)
  }
}
