import { inject, Injectable, signal } from '@angular/core';
import { Division, DivisionId, Entry, EntryId, Form, FormId, Page, PageId } from '@cs-forms/shared';
import { ExtendedObjectType, extendedRecord } from '@src/helpers/utils';
import { LocalStorageService } from '../services/localStorageService';

export type User = { id: string; name: string };
type All = {
  forms: Record<FormId, Form>;
  pages: Record<PageId, Page>;
  division: Record<DivisionId, Division>;
  entries: Record<EntryId, Entry>;
};

@Injectable({ providedIn: 'root' })
export class Store {
  localStorage = inject(LocalStorageService);

  private _user = signal<User | null>(null);
  private _forms = signal<ExtendedObjectType<FormId, Form> | null>(null);
  private _pages = signal<ExtendedObjectType<PageId, Page> | null>(null);
  private _divisions = signal<ExtendedObjectType<DivisionId, Division> | null>(null);
  private _entries = signal<ExtendedObjectType<EntryId, Entry> | null>(null);

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
    this._user.set(user);
  };

  setData = (payload: All | null) => {
    this._forms.set(payload?.forms ? extendedRecord<FormId, Form>(payload.forms) : null);
    this._pages.set(payload?.pages ? extendedRecord<PageId, Page>(payload.pages) : null);
    this._divisions.set(payload?.division ? extendedRecord<DivisionId, Division>(payload.division) : null);
    this._entries.set(payload?.entries ? extendedRecord<EntryId, Entry>(payload.entries) : null);
  };

  setForms = (forms: Map<FormId, Form> | null) => {
    this._forms.set(forms ? extendedRecord<FormId, Form>(Object.fromEntries(forms)) : null);
  };

  setPages = (pages: Map<PageId, Page> | null) => {
    this._pages.set(pages ? extendedRecord<PageId, Page>(Object.fromEntries(pages)) : null);
  };

  setDivisions = (divisions: Map<DivisionId, Division> | null) => {
    this._divisions.set(divisions ? extendedRecord<DivisionId, Division>(Object.fromEntries(divisions)) : null);
  };

  setEntries = (entries: Map<EntryId, Entry> | null) => {
    this._entries.set(entries ? extendedRecord<EntryId, Entry>(Object.fromEntries(entries)) : null);
  };

  storeForm = (form: Form) => {
    this._forms.update(forms => {
      if (forms) {
        forms[form.id] = form;
        forms = extendedRecord<FormId, Form>({ ...forms });
      } else forms = extendedRecord<FormId, Form>({ [form.id]: form });
      return forms;
    });
  };

  storePage = (page: Page) => {
    this._pages.update(pages => {
      if (pages) {
        pages[page.id] = page;
        pages = extendedRecord<PageId, Page>({ ...pages });
      } else pages = extendedRecord<PageId, Page>({ [page.id]: page });
      return pages;
    });
  };

  storeDivision = (division: Division) => {
    this._divisions.update(divisions => {
      if (divisions) {
        divisions[division.id] = division;
        divisions = extendedRecord<DivisionId, Division>({ ...divisions });
      } else divisions = extendedRecord<DivisionId, Division>({ [division.id]: division });
      return divisions;
    });
  };

  storeEntry = (page: Entry) => {
    this._entries.update(entries => {
      if (entries) {
        entries[page.id] = page;
        entries = extendedRecord<EntryId, Entry>({ ...entries });
      } else entries = extendedRecord<EntryId, Entry>({ [page.id]: page });
      return entries;
    });
  };
}
