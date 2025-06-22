/*
import { effect, inject, Injectable } from '@angular/core';
import { AnswerTypeEnum, Question } from '@cs-forms/shared';
import { AnswerResource } from 'src/resources/answerResource';
import { ConditionResource } from 'src/resources/conditionsResource';
import { QuestionResource } from 'src/resources/questionResource';
import { SectionResource } from 'src/resources/sectionResource';
import { CurrentStore } from 'src/stores/currentStore';
import { v4 as uid } from 'uuid';
import { currentQuestionPayload } from './utils';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly _currentStore = inject(CurrentStore);
  private readonly _sectionResource = inject(SectionResource);
  private readonly _questionResource = inject(QuestionResource);
  private readonly _answerResource = inject(AnswerResource);
  private readonly _conditionResource = inject(ConditionResource);

  protected readonly _questionIds = this._currentStore.currentQuestionIds;
  protected readonly _currentQuestionId = this._currentStore.currentQuestionId;
  protected readonly _currentQuestion = this._currentStore.currentQuestion;

  constructor() {
    effect(() => {
      // this._currentStore.setCurrentQuestion(this._questionResource.questions()?.get?.(this._currentStore.currentQuestionId()) ?? null);
    });
  }

  add = (entry: string) => {
    console.log('add question');
    const newQuestion: Question = {
      id: `question-${uid()}`,
      entry,
      updated: new Date().valueOf(),
      answerType: AnswerTypeEnum.RadioButton,
      answers: [],
      validators: [],
      conditions: [],
    };

    this._questionResource.add(newQuestion);
    this._currentStore.updateCurrentSection('questions', [newQuestion.id]);
    /*
    const currentSection = this._currentStore.currentSection();

    if (currentSection)
      this._sectionResource.update(
        currentSectionPayload(
          currentSection,
          this._questionResource.questions(),
          this._answerResource.answers(),
          this._conditionResource.conditions()
        )
      );
      
  };

  updateCurrentQuestion<K extends keyof Question>(key: K, update: Question[K]): void {
    this._currentStore.updateCurrentQuestion(key, update);
  }

  saveCurrentQuestion() {
    console.log('Save Current Question');
    const question = this._currentQuestion();
    if (question) {
      const payload = currentQuestionPayload(question, this._answerResource.answers(), this._conditionResource.conditions());
      this._questionResource.update(payload);
    }
  }
}
*/
