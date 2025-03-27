import { computed, Injectable, signal } from '@angular/core';
import questionJson from '../../../assets/questions.json';
import { Language } from '../../../helpers/enum';
import { buildTree, toTranslationsFormGroup } from './questions.utils';
import { FormTranslations, Question, TranslationCollection } from '../../../helpers/types';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private _currentLanguage = signal<Language>(Language.Swedish);
  private _questions = signal<Question[]>(questionJson);
  private _openTranslations = signal<Set<string>>(new Set());

  currentLanguage = computed(() => this._currentLanguage);
  questions = computed(() => this._questions())
  openTranslations = computed(() => this._openTranslations);

  questionsFormGroup = toTranslationsFormGroup(this._questions())
  treeQuestions = computed(() => {
    return buildTree(this._questions())
  })

  setLanguage(lang: Language) {
    this._currentLanguage.set(lang);
  }
  filteredQuestions(filterString: string) {
    return this.questions().map(q => q.translationPath).filter(q => q.includes(filterString))
  }
  getLanguageFormGroup(id: string): FormTranslations {
    console.log(id, this.questionsFormGroup);
    const translationKey = id as keyof TranslationCollection;
    const formGroup = this.questionsFormGroup.controls[translationKey]
    if (!formGroup) throw console.log(`No formgroup with id: ${id}`)
    return formGroup as FormTranslations
  }



  addQuestion(group: TranslationCollection): void {
    console.log(group);
  }

  updateQuestion(updatedQuestion: Question): void {

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
