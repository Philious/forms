import { Injectable } from '@angular/core';
import { Question, QuestionId, QuestionPayload } from '@cs-forms/shared';
import { Observable } from 'rxjs';
import { Api } from './api.config';

@Injectable({
  providedIn: 'root',
})
export class QuestionStore extends Api {
  getAll() {
    return this._http.get<Question[]>(`/api/questions`, { withCredentials: true });
  }

  getBatch(ids: QuestionId[]): Observable<QuestionPayload[]> {
    return this._http.post<QuestionPayload[]>(`/api/questions/batch`, ids, { withCredentials: true });
  }

  getById(id: QuestionId): Observable<QuestionPayload> {
    return this._http.get<QuestionPayload>(`/api/questions/${id}`, { withCredentials: true });
  }

  add(newQuestion: QuestionPayload): Observable<QuestionPayload> {
    return this._http.post<QuestionPayload>(`/api/questions/add`, newQuestion, { withCredentials: true });
  }

  update(update: QuestionPayload): Observable<QuestionPayload> {
    return this._http.post<QuestionPayload>(`/api/questions/update`, update, { withCredentials: true });
  }

  remove(id: QuestionId) {
    return this._http.delete<QuestionPayload>(`/api/questions/${id}`);
  }
}
