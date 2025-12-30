import { Injectable } from '@angular/core';
import { Division, Entry, Form, Page } from '@cs-forms/shared';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  form: Form | null;
  page: Page;
  division: Division;
  entry: Entry;
  get = {
    form: (): Form | null => this.form,
    page: (): Page | null => this.page,
    division: (): Division | null => this.division,
    entry: (): Entry | null => this.entry,
  };
  set = {
    form: (form: Form | null): void => {
      localStorage.setItem('form', JSON.stringify(form));
      console.log('set form', form);
    },
    page: (page: Page | null): void => localStorage.setItem('page', JSON.stringify(page)),
    division: (division: Division | null): void => localStorage.setItem('division', JSON.stringify(division)),
    entry: (entry: Entry | null): void => localStorage.setItem('entry', JSON.stringify(entry)),
  };
  clear = {
    form: (): void => {
      localStorage.removeItem('form');
    },
    page: (): void => localStorage.removeItem('page'),
    division: (): void => localStorage.removeItem('division'),
    entry: (): void => localStorage.removeItem('entry'),
  };
  constructor() {
    this.form = JSON.parse(localStorage.getItem('form') ?? 'null');
    this.page = JSON.parse(localStorage.getItem('page') ?? 'null');
    this.division = JSON.parse(localStorage.getItem('division') ?? 'null');
    this.entry = JSON.parse(localStorage.getItem('entry') ?? 'null');
  }
}
