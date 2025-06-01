import { inject, Injectable } from '@angular/core';
import { Question, QuestionId, QuestionPayload } from '@cs-forms/shared';
import { map, Observable } from 'rxjs';
import { Store } from 'src/stores/store';
import { QuestionStore } from '../stores/questionStore';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private readonly _store = inject(Store);
  private readonly _questionStore = inject(QuestionStore);

  questionIds = this._store.questionIds;
  currentQuestionId = this._store.currentQuestionId;
  currentQuestion = this._store.currentQuestion;

  add = (payload: QuestionPayload) => {
    this._questionStore.add(payload).subscribe({
      next: () => this._store.question.setById(this._store.storeQuestionPayload(payload).id),
      error: err => console.error('Error adding question', err),
    });
  };

  getQuestionsByCurrentSectionId = () => {
    const questions = this._store.section.getQuestionsBySectionId(this._store.currentSectionId() ?? '');
    const filteredQuestions = questions.map(q => q?.id).filter(q => !q) as QuestionId[];

    if (questions.length > filteredQuestions.length) {
      return this._questionStore.getBatch(filteredQuestions).pipe(map(payloads => payloads.map(payload => this._store.payloadToQuestion(payload))));
    } else return new Observable<Question[]>(subscriber => subscriber.next(questions as Question[]));
  };

  set(id: string): void {
    this._store.question.setById(id);
  }

  update(payload: QuestionPayload): void {
    this._store.question.update(payload);
  }

  delete(id: QuestionId): void {
    this._store.question.remove(id);
    this._questionStore.remove(id);
  }
}
