/*
import { computed, effect, Injectable, signal } from '@angular/core';
import { Question, QuestionId, Section, SectionId } from '@cs-forms/shared';
import { replaceKeyInObject, updateKeyInObject } from 'src/services/utils';

@Injectable({ providedIn: 'root' })
export class CurrentStore {
  protected readonly _currentSectionId = signal<SectionId>('');
  protected readonly _currentSection = signal<Section | null>(null);

  protected readonly _currentQuestionId = signal<QuestionId>('');
  protected readonly _currentQuestion = signal<Question | null>(null);

  protected readonly _canSave = signal<boolean>(false);

  currentSectionId = this._currentSectionId.asReadonly();
  currentSection = this._currentSection.asReadonly();

  currentQuestionId = this._currentQuestionId.asReadonly();
  currentQuestion = this._currentQuestion.asReadonly();

  currentQuestionIds = computed<QuestionId[]>(() => this._currentSection()?.questions ?? []);

  canSave = this._canSave.asReadonly();

  constructor() {
    effect(() => {
      console.log(this._currentSection());
      console.log(this.currentQuestionIds());
      console.log(this._currentQuestion());
    });
  }

  setCurrentSectionId = (id: SectionId) => this._currentSectionId.set(id);
  setCurrentSection = (section: Section | null) => this._currentSection.set(section);

  setCurrentQuestionId = (id: QuestionId) => this._currentQuestionId.set(id);
  setCurrentQuestion = (question: Question | null) => this._currentQuestion.set(question);

  updateCurrentSection<K extends keyof Section>(key: K, update: Section[K], updateType: 'replace' | 'add' = 'add'): void {
    console.log('updateCurrentSection', key, update);
    this._currentSection.update(section => {
      const sectionUpdate = updateType === 'add' ? updateKeyInObject(section, key, update) : replaceKeyInObject(section, key, update);
      if (sectionUpdate) return { ...sectionUpdate, questions: [...sectionUpdate.questions] };
      return section;
    });
  }
}
*/
