import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AriaDropComponent, OptionProps } from '@app/components/action/aria-drop.component';
import { Division, Entry, Form, Option, Page } from '@cs-forms/shared';
import { IconButtonComponent } from '@src/app/components/action/icon-button.component';
import { TextFieldComponent } from '@src/app/components/action/textfield.component';
import { AddDialog } from '@src/app/components/modals/add.new.dialog.component';
import { ContextMenuComponent } from '@src/app/components/modals/contextMenu.component';
import { ListComponent, ListItem } from '@src/app/components/reorerableList.component';
import { ApiService } from '@src/app/services/api.service';
import { LocaleService } from '@src/app/services/locale.service';
import { LocalStorageService } from '@src/app/services/localStorageService';
import { Store } from '@src/app/store/store';
import { IconEnum, Locale } from '@src/helpers/enum';
import { itemOptions, newEntry } from '@src/helpers/form.utils';
import { Translation } from '@src/helpers/translationTypes';
import { EntryTypeEnum } from '@src/helpers/types';
import { LayoutComponent } from '../common/layout.component';
import { loadPageFn, mergeListItem, updateSelectedAriaOptionFn } from '../common/page.utilities';
import { ActiveEntryComponent } from './activeEntry/activeEntry.component';

export type PartialEntry<T extends EntryTypeEnum = EntryTypeEnum> = Partial<Exclude<Entry<T>, 'id' | 'label' | 'updated'>> &
  Pick<Entry<T>, 'id' | 'label' | 'updated'>;

@Component({
  selector: 'entries-page',
  imports: [
    LayoutComponent,
    IconButtonComponent,
    ContextMenuComponent,
    TextFieldComponent,
    CommonModule,
    ActiveEntryComponent,
    FormsModule,
    ReactiveFormsModule,
    AriaDropComponent,
    ListComponent,
  ],
  template: `<layout [contentTitle]="'Select an entry'">
    <span content header>Entry details</span>
    <span content location>
      <aria-drop light [items]="formOptions()" [label]="'Form'" [selected]="selectedForm()" (selectedChange)="updateSelectedForm($event)" />
      <aria-drop light [items]="pageOptions()" [label]="'Page'" [selected]="selectedPage()" (selectedChange)="updateSelectedPage($event)" />
      <aria-drop
        light
        [items]="divisionOptions()"
        [label]="'Division'"
        [selected]="selectedDivision()"
        (selectedChange)="updateSelectedDivision($event)"
      />
      <text-field class="search" slim [label]="'Search'" [prefixIcon]="IconEnum.Search" />
    </span>
    <span list>
      <list [(list)]="filteredEntryeList" (selectedChange)="updateSelected($event)" />
    </span>
    <span content item-options class="entry-options">
      <icon-button [class.can-save]="!currentSaved()" [icon]="IconEnum.Save" (clicked)="save()" />
      <icon-button [icon]="IconEnum.Add" (clicked)="add()" />
      <context-menu [options]="entryLabelOptions">
        <icon-button [icon]="IconEnum.Options" />
      </context-menu>
    </span>
    <span specifics>
      @let currentEntry = this.store.currentEntry();
      @if (currentEntry) {
        <active-entry [entry]="currentEntry" [updatedAt]="currentEntry.updated" (updateEntry)="updateEntry($event)" />
      } @else {
        Create or select an entry
      }
    </span>
  </layout>`,
  styles: `
    :host {
      display: flex;
      flex: 1;
    }
    .add-new {
      margin-right: auto;
    }
    .entry-options {
      color: var(--n-500);
    }
    .can-save {
      color: var(--p-500);
    }
    .search {
      margin-top: 0.75rem;
    }
  `,
})
export class EntriesComponent {
  IconEnum = IconEnum;
  store = inject(Store);
  apiService = inject(ApiService);
  localeService = inject(LocaleService);
  localStorage = inject(LocalStorageService);
  addDialog = inject(AddDialog);

  protected searchString = signal<string>('');
  protected currentSaved: Signal<boolean>;
  protected entryList: WritableSignal<ListItem[]>;
  protected filteredEntryeList = linkedSignal<ListItem[]>(() =>
    this.entryList().filter(
      p =>
        !this.store.currentForm() ||
        (this.store.currentForm()?.entries.includes(p.id) && !this.store.currentPage()) ||
        (this.store.currentPage()?.entries.includes(p.id) && !this.store.currentDivision()) ||
        this.store.currentDivision()?.entries.includes(p.id)
    )
  );

  protected formOptions = computed<OptionProps<Form>[]>(() => itemOptions<Form>(this.store.forms() ?? {}, this.localeService.translate));
  protected selectedForm = linkedSignal<string[]>(() => {
    const id = this.store.currentForm()?.id;
    return id ? [id] : [];
  });

  protected pageOptions = computed<OptionProps<Page>[]>(() => itemOptions<Page>(this.store.pages() ?? {}, this.localeService.translate));
  protected selectedPage = linkedSignal<string[]>(() => {
    const id = this.store.currentPage()?.id;
    return id ? [id] : [];
  });

  protected divisionOptions = computed<OptionProps<Division>[]>(() =>
    itemOptions<Division>(this.store.divisions() ?? {}, this.localeService.translate)
  );
  protected selectedDivision = linkedSignal<string[]>(() => {
    const id = this.store.currentDivision()?.id;
    return id ? [id] : [];
  });

  protected entryLabelOptions: Option<string>[] = [{ label: 'Change entry name', value: 'changeName' }];

  protected updateSelected: (id: string | null) => void;
  protected save: () => void;
  protected remove: (id: string) => void;
  protected updateLabel: (translation: Translation) => void;

  protected updateSelectedForm = updateSelectedAriaOptionFn<Form>(this.formOptions, this.store.currentForm);
  protected updateSelectedPage = updateSelectedAriaOptionFn<Page>(this.pageOptions, this.store.currentPage);
  protected updateSelectedDivision = updateSelectedAriaOptionFn<Division>(this.divisionOptions, this.store.currentDivision);

  protected updateEntry(entry: Entry) {
    console.log(entry);
  }

  protected async add() {
    this.localeService.set(Locale.XX);
    const pageTranslationKey = this.store.currentDivision()?.label.translationKey || '';
    const currentFormId = this.store.currentForm()?.id;
    const currentPageId = this.store.currentPage()?.id;
    const currentDivisionId = this.store.currentPage()?.id;
    if (!currentFormId || !currentPageId || !currentDivisionId) return; // add fail indication event

    await this.addDialog.open({ title: 'Add new division', content: '', initialValue: pageTranslationKey + '.' }).then(value => {
      const entry = newEntry({ label: value });

      this.entryList.update(list => mergeListItem(list, entry, this.localeService.translate));
      this.store.currentEntry.set(entry);

      const form = this.store.currentForm();
      if (form) {
        form.entries.push(entry.id);
        this.store.currentForm.set(form);
        this.apiService.post.form(form);
      }

      const page = this.store.currentPage();
      if (page) {
        page.entries.push(entry.id);
        this.store.currentPage.set(page);
        this.apiService.post.page(page);
      }

      const division = this.store.currentDivision();
      if (division) {
        division.entries.push(entry.id);
        this.store.currentDivision.set(division);
        this.apiService.post.division(division);
      }
    });
  }

  constructor() {
    console.log('create entry component');
    const { currentSaved, list, updateSelected, save, updateLabel, remove } = loadPageFn<Entry>(
      this.store.currentEntry,
      this.store.entries,
      this.localeService.translate,
      this.store.storeEntry,
      this.apiService.post.entry,
      this.apiService.delete.entry
    );

    this.currentSaved = currentSaved;
    this.entryList = list;
    this.updateSelected = updateSelected;
    this.save = save;
    this.remove = remove;
    this.updateLabel = updateLabel;
  }
}
