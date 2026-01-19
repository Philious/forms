import { effect, inject, Injectable, signal } from '@angular/core';
import { Division, DivisionId, Entry, EntryId, Form, FormId, Page, PageId } from '@cs-forms/shared';
import { ExtendedObjectType, extendedRecord } from '@src/helpers/utils';
import { LocalStorageService } from '../services/localStorageService';

export type User = { id: string; name: string };
type All = {
  forms: Record<FormId, Form>;
  pages: Record<PageId, Page>;
  divisions: Record<DivisionId, Division>;
  entries: Record<EntryId, Entry>;
};

@Injectable({ providedIn: 'root' })
export class Store {
  localStorage = inject(LocalStorageService);

  private _user = signal<User | null>(null);
  private _forms = signal<ExtendedObjectType<Record<FormId, Form>> | null>(null);
  private _pages = signal<ExtendedObjectType<Record<PageId, Page>> | null>(null);
  private _divisions = signal<ExtendedObjectType<Record<DivisionId, Division>> | null>(null);
  private _entries = signal<ExtendedObjectType<Record<EntryId, Entry>> | null>(null);

  user = this._user.asReadonly();
  forms = this._forms.asReadonly();
  pages = this._pages.asReadonly();
  divisions = this._divisions.asReadonly();
  entries = this._entries.asReadonly();

  currentForm = signal<Form | null>(null);
  currentPage = signal<Page | null>(null);
  currentDivision = signal<Division | null>(null);
  currentEntry = signal<Entry | null>(null);

  constructor() {
    effect(() => {
      console.log('forms: ', this.forms());
      console.log('pages: ', this.pages());
      console.log('divisions: ', this.divisions());
      console.log('entries: ', this.entries());
    });
  }
  setUser = (user: User | null) => {
    this._user.set(user);
  };

  setData = (payload: All | null) => {
    this._forms.set(payload?.forms ? extendedRecord(payload.forms) : null);
    this._pages.set(payload?.pages ? extendedRecord(payload.pages) : null);
    this._divisions.set(payload?.divisions ? extendedRecord(payload.divisions) : null);
    this._entries.set(payload?.entries ? extendedRecord(payload.entries) : null);
  };

  setForms = (formsMap: Map<FormId, Form> | null) => {
    const forms = Object.fromEntries(formsMap || new Map()) as Record<FormId, Form>;
    this._forms.set(forms.length ? extendedRecord(forms) : null);
  };

  setPages = (pagesMap: Map<PageId, Page> | null) => {
    const pages = Object.fromEntries(pagesMap || new Map()) as Record<PageId, Page>;
    this._pages.set(pages ? extendedRecord(pages) : null);
  };

  setDivisions = (divisionsMap: Map<DivisionId, Division> | null) => {
    const divisions = Object.fromEntries(divisionsMap || new Map()) as Record<DivisionId, Division>;
    this._divisions.set(divisions ? extendedRecord(divisions) : null);
  };

  setEntries = (entriesMap: Map<EntryId, Entry> | null) => {
    const entries = Object.fromEntries(entriesMap || new Map()) as Record<EntryId, Entry>;
    this._entries.set(entries ? extendedRecord(entries) : null);
  };

  storeForm = (form: Form) => {
    this._forms.update(forms => {
      if (forms) {
        forms[form.id] = form;
        forms = extendedRecord<Record<FormId, Form>>({ ...forms });
      } else forms = extendedRecord<Record<FormId, Form>>({ [form.id]: form });
      return forms;
    });
  };

  storePage = (page: Page) => {
    this._pages.update(pages => {
      if (pages) {
        pages[page.id] = page;
        pages = extendedRecord<Record<PageId, Page>>({ ...pages });
      } else pages = extendedRecord<Record<PageId, Page>>({ [page.id]: page });
      return pages;
    });
  };

  storeDivision = (division: Division) => {
    this._divisions.update(divisions => {
      if (divisions) {
        divisions[division.id] = division;
        divisions = extendedRecord<Record<DivisionId, Division>>({ ...divisions });
      } else divisions = extendedRecord<Record<DivisionId, Division>>({ [division.id]: division });
      return divisions;
    });
  };

  storeEntry = (page: Entry) => {
    this._entries.update(entries => {
      if (entries) {
        entries[page.id] = page;
        entries = extendedRecord<Record<EntryId, Entry>>({ ...entries });
      } else entries = extendedRecord<Record<EntryId, Entry>>({ [page.id]: page });
      return entries;
    });
  };
}
