import { Injectable, signal } from '@angular/core';
import { Division, DivisionId, Entry, EntryId, Form, FormId, Page, PageId } from '@cs-forms/shared';

export type User = { id: string; name: string };
type All = {
  forms: Record<FormId, Form>;
  pages: Record<PageId, Page>;
  division: Record<DivisionId, Division>;
  entries: Record<EntryId, Entry>;
};

@Injectable({ providedIn: 'root' })
export class Store {
  private _user = signal<User | null>(null);
  private _forms = signal<Record<FormId, Form> | null>(null);
  private _pages = signal<Record<PageId, Page> | null>(null);
  private _divisions = signal<Record<DivisionId, Division> | null>(null);
  private _entries = signal<Record<EntryId, Entry> | null>(null);
  private _entry = signal<Entry | null>(null);

  user = this._user.asReadonly();
  forms = this._forms.asReadonly();
  pages = this._pages.asReadonly();
  divisions = this._divisions.asReadonly();
  entries = this._entries.asReadonly();

  currentForm = signal<Form | null>(null);
  currentPage = signal<Page | null>(null);
  currentDivision = signal<Division | null>(null);
  currentEntry = signal<Entry | null>(null);

  setUser = (user: User | null) => {
    // console.log('User: ', this);
    this._user.set(user);
  };

  setData = (payload: All | null) => {
    // console.log('set data', payload);
    this._forms.set(payload?.forms ?? null);
    this._pages.set(payload?.pages ?? null);
    this._divisions.set(payload?.division ?? null);
    this._entries.set(payload?.entries ?? null);
  };

  setForms = (forms: Map<FormId, Form> | null) => {
    this._forms.set(forms ? Object.fromEntries(forms) : null);
  };

  setPages = (pages: Map<PageId, Page> | null) => {
    this._pages.set(pages ? Object.fromEntries(pages) : null);
  };

  setDivisions = (divisions: Map<DivisionId, Division> | null) => {
    this._divisions.set(divisions ? Object.fromEntries(divisions) : null);
  };

  setEntries = (entries: Map<EntryId, Entry> | null) => {
    this._entries.set(entries ? Object.fromEntries(entries) : null);
  };

  setForm = (form: Form | null) => {
    this.currentForm.set(form);
  };
  setPage = (page: Page | null) => {
    this.currentPage.set(page);
  };
  setDivision = (division: Division | null) => {
    this.currentDivision.set(division);
  };
  setEntry = (entry: Entry | null) => {
    this.currentEntry.set(entry);
  };
}
