import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AriaDropComponent, OptionProps } from '@app/components/action/aria-drop.component';
import { Division, Entry, Form, Option, Page } from '@cs-forms/shared';
import { IconButtonComponent } from '@src/app/components/action/icon-button.component';
import { SignalInputLayoutComponent } from '@src/app/components/action/input-layout/signal-input.layout.component';
import { TextFieldComponent } from '@src/app/components/action/textfield.component';
import { ContextMenuComponent } from '@src/app/components/modals/contextMenu.component';
import { ListComponent } from '@src/app/components/reorerableList.component';
import { ApiService } from '@src/app/services/api.service';
import { LocaleService } from '@src/app/services/locale.service';
import { Store } from '@src/app/store/store';
import { IconEnum, Locale } from '@src/helpers/enum';
import { itemOptions, newEntry } from '@src/helpers/form.utils';
import { EntryTypeEnum } from '@src/helpers/types';
import { LayoutComponent } from '../common/layout.component';
import { ActiveEntryComponent } from './activeEntry/activeEntry.component';

export type PartialEntry<T extends EntryTypeEnum = EntryTypeEnum> = Partial<Exclude<Entry<T>, 'id' | 'translations' | 'updated'>> &
  Pick<Entry<T>, 'id' | 'translations' | 'updated'>;

@Component({
  selector: 'entries-page',
  imports: [
    LayoutComponent,
    SignalInputLayoutComponent,
    IconButtonComponent,
    ContextMenuComponent,
    TextFieldComponent,
    CommonModule,
    ActiveEntryComponent,
    ListComponent,
    FormsModule,
    ReactiveFormsModule,
    AriaDropComponent,
  ],
  template: `<layout [contentTitle]="'Select an entry'">
    <span content header>Entry details</span>
    <span content header-options>
      <icon-button [class.can-save]="canSave()" [icon]="IconEnum.Save" (clicked)="save()" />
      <icon-button [icon]="IconEnum.Add" (clicked)="add()" />
      <context-menu [options]="pageHeaderOptions">
        <icon-button [icon]="IconEnum.Options" />
      </context-menu>
    </span>
    <span content location>
      <signal-input-layout [type]="'text'" slim [label]="'Form'" [sufix]="IconEnum.Down">
        <aria-drop [items]="formOptions()" [selected]="selectedForm()" (selectedChange)="updateSelectedForm($event)" />
      </signal-input-layout>
      <signal-input-layout [type]="'text'" slim [label]="'Page'" [sufix]="IconEnum.Down">
        <aria-drop [items]="pageOptions()" [selected]="selectedPage()" (selectedChange)="updateSelectedPage($event)" />
      </signal-input-layout>
      <signal-input-layout [type]="'text'" slim [label]="'Page'" [sufix]="IconEnum.Down">
        <aria-drop [items]="divisionOptions()" [selected]="selectedDivision()" (selectedChange)="updateSelectedDivision($event)" />
      </signal-input-layout>
      <text-field slim [label]="'Search'" [prefixIcon]="IconEnum.Search" />
    </span>
    <span list>
      <list [(list)]="entryList" [findLabelFn]="listLabel(locale())" (updateSelected)="this.currentEntry.set($event)" />
    </span>

    <span specifics>
      @let currentEntry = this.currentEntry();
      @if (currentEntry) {
        <active-entry [entry]="currentEntry" />
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
  `,
})
export class EntriesComponent {
  apiService = inject(ApiService);
  localeService = inject(LocaleService);
  store = inject(Store);
  IconEnum = IconEnum;

  currentEntry = this.store.currentEntry as WritableSignal<PartialEntry | null>;
  locale = this.localeService.activeLocale;
  canSave = signal<boolean>(false);

  protected entryOrder = computed(() => this.entryList().map(e => e.id));
  protected pageHeaderOptions: Option<string>[] = [{ label: 'Change section name', value: 'changeName' }];
  protected sectionList = [{ label: 'Change section name', value: 'changeName' }];
  protected entryList = linkedSignal<PartialEntry[]>(() => {
    const entries = this.store.entries();
    return entries ? Object.values(entries) : [];
  });

  protected showId = signal<boolean>(false);

  protected selectedForm = linkedSignal<string[]>(() => {
    return (
      this.formOptions()
        .filter(o => o.id === this.store.currentForm()?.id)
        ?.map(o => o.value) || []
    );
  });
  protected selectedPage = linkedSignal<string[]>(() => {
    return (
      this.formOptions()
        .filter(o => o.id === this.store.currentPage()?.id)
        ?.map(o => o.value) || []
    );
  });
  protected selectedDivision = linkedSignal<string[]>(() => {
    return (
      this.divisionOptions()
        .filter(o => o.id === this.store.currentDivision()?.id)
        ?.map(o => o.value) || []
    );
  });

  protected formOptions = computed<OptionProps<Form>[]>(() => itemOptions<Form>(this.store.forms() ?? {}));
  protected pageOptions = computed<OptionProps<Page>[]>(() => itemOptions<Page>(this.store.pages() ?? {}));
  protected divisionOptions = computed<OptionProps<Division>[]>(() => itemOptions<Division>(this.store.divisions() ?? {}));

  protected updateSelectedForm(event: string[]) {
    const selectedForm = this.formOptions().find(o => o.value && event.includes(o.value))?.data;
    if (selectedForm) this.store.setForm(selectedForm);
  }
  protected updateSelectedPage(event: string[]) {
    const selectedPage = this.pageOptions().find(o => o.value && event.includes(o.value))?.data;
    if (selectedPage) this.store.setPage(selectedPage);
  }
  protected updateSelectedDivision(event: string[]) {
    const selectedDivision = this.divisionOptions().find(o => o.value && event.includes(o.value))?.data;
    if (selectedDivision) this.store.setDivision(selectedDivision);
  }

  protected setActive() {}
  protected listLabel(locale: Locale): (k: Pick<Entry, 'translations'>) => string {
    return (k: Pick<Entry, 'translations'>) => k.translations[locale] ?? 'No translation';
  }
  protected add() {
    this.entryList.update(list => {
      list.push(newEntry());

      return list;
    });
  }

  protected save() {
    const entry = this.currentEntry();
    const keys: (keyof Entry)[] = ['id', 'type', 'translations', 'updated', 'entrySpecific'];

    const missingKey = keys.filter(k => !entry || !entry[k]);
    if (missingKey.length) console.error(`${missingKey.join(', ')} missing`);
    else this.apiService.post.entry(entry as Entry);
  }

  constructor() {}
}
