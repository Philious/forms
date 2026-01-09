import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Division, DivisionId, Entry, EntryId, Form, FormId, Page, PageId } from '@cs-forms/shared';
import { Store, User } from '../store/store';
import { ApiObserverOptions, createDeleteHelper, createGetHelper, createPostHelper } from './helpers';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly store = inject(Store);
  private readonly baseUrl = 'http://localhost:3000';

  private _get = createGetHelper(this.http, `${this.baseUrl}/api/get`);
  private _post = createPostHelper(this.http, `${this.baseUrl}/api/set`);
  private _delete = createDeleteHelper(this.http, `${this.baseUrl}/api/delete`);

  constructor() {}
  // ---------- methods ----------

  get = {
    user: (options?: ApiObserverOptions<User>) =>
      this._get('/user', {
        ...options,
        error: err => console.log('error', err),
        next: this.store.setUser,
      }),
    all: (options?: ApiObserverOptions<never>) =>
      this._get(`/all`, {
        ...options,
        next: this.store.setData,
      }),
    form: (formId: FormId, options?: ApiObserverOptions<Form>) =>
      this._get(`/form/${formId}`, {
        ...options,
        next: (form: Form) => this.store.currentForm.set(form),
      }),
    page: (pageId: PageId, options?: ApiObserverOptions<Page>) =>
      this._get(`/page/${pageId}`, {
        ...options,
        next: (page: Page) => this.store.currentPage.set(page),
      }),
    division: (divId: DivisionId, options?: ApiObserverOptions<Division>) =>
      this._get(`/division/${divId}`, {
        ...options,
        next: (division: Division) => this.store.currentDivision.set(division),
      }),
    entry: (entryId: EntryId, options?: ApiObserverOptions<Entry>): void =>
      this._get(`/entry${entryId}`, {
        ...options,
        next: (entry: Entry) => this.store.currentEntry.set(entry),
      }),
    allForms: (options?: ApiObserverOptions<never>) =>
      this._get('/all/forms', {
        ...options,
        next: this.store.setForms,
      }),
    allEntries: (options?: ApiObserverOptions<never>) =>
      this._get('/all/entries', {
        ...options,
        next: this.store.setEntries,
      }),
  };

  post = {
    form: (form: Form, options?: ApiObserverOptions<Form>) => this._post('/form', form, { ...options }),
    page: (page: Page, options?: ApiObserverOptions<Page>) => this._post('/page', page, { ...options }),
    division: (division: Division, options?: ApiObserverOptions<Division>) => this._post('/division', division, { ...options }),
    entry: (entry: Entry, options?: ApiObserverOptions<Entry>) => this._post('/entry', entry, { ...options }),
  };

  delete = {
    form: (id: FormId) => {
      this._delete('/form', id);
    },
    page: (id: PageId) => {
      this._delete('/page', id);
    },
    division: (id: DivisionId) => {
      this._delete('/division', id);
    },
    entry: (id: EntryId) => {
      this._delete('/entry', id);
    },
  };
}
