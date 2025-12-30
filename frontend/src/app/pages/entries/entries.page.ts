import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AriaDropComponent, OptionProps } from '@app/components/action/aria-drop.component';
import { Division, Entry, Form, Option, Page } from '@cs-forms/shared';
import { IconButtonComponent } from '@src/app/components/action/icon-button.component';
import { SignalInputLayoutComponent } from '@src/app/components/action/input-layout/signal-input.layout.component';
import { TextFieldComponent } from '@src/app/components/action/textfield.component';
import { ContextMenuComponent } from '@src/app/components/modals/contextMenu.component';
import { ListItem } from '@src/app/components/reorerableList.component';
import { ApiService } from '@src/app/services/api.service';
import { LocaleService } from '@src/app/services/locale.service';
import { LocalStorageService } from '@src/app/services/localStorageService';
import { Store } from '@src/app/store/store';
import { IconEnum, Locale } from '@src/helpers/enum';
import { itemOptions } from '@src/helpers/form.utils';
import { EntryTypeEnum } from '@src/helpers/types';
import { LayoutComponent } from '../common/layout.component';
import { ActiveEntryComponent } from './activeEntry/activeEntry.component';

export type PartialEntry<T extends EntryTypeEnum = EntryTypeEnum> = Partial<Exclude<Entry<T>, 'id' | 'label' | 'updated'>> &
  Pick<Entry<T>, 'id' | 'label' | 'updated'>;

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
    FormsModule,
    ReactiveFormsModule,
    AriaDropComponent,
  ],
  template: `<layout [contentTitle]="'Select an entry'">
    <span content header>Entry details</span>
    <span content header-options>
      <icon-button [class.can-save]="canSave()" [icon]="IconEnum.Save" (clicked)="save()" />
      <icon-button [icon]="IconEnum.Add" (clicked)="add()" />
      <context-menu [options]="pageLabelOptions">
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
      <!--<list [(list)]="entryList" [findLabelFn]="listLabel(locale())" (updateSelected)="this.currentEntry.set($event)" />-->
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
  localStorage = inject(LocalStorageService);
  IconEnum = IconEnum;

  currentSaved = computed<boolean>(() => {
    const pages = this.store.entries()?.values() ?? [];
    const ce = this.store.currentEntry();

    return !ce || pages.length === 0 || (!!ce && pages.filter(e => e.id === ce.id).length !== 0);
  });

  currentEntry = this.store.currentEntry as WritableSignal<PartialEntry | null>;
  locale = this.localeService.activeLocale;
  canSave = signal<boolean>(false);

  protected pageLabelOptions: Option<string>[] = [{ label: 'Change section name', value: 'changeName' }];
  protected sectionList = [{ label: 'Change section name', value: 'changeName' }];

  entryList = linkedSignal<ListItem[]>(() => {
    const entries = this.store.entries()?.values() ?? [];
    const ce = this.store.currentEntry();

    if (ce && entries.filter(e => e.id === ce.id).length === 0) {
      entries.push(ce);
    }

    return entries.map(e => ({
      id: e.id,
      label: this.localeService.translate(e.label),
      selected: e.id === ce?.id,
      color: e.id === ce?.id && !this.currentSaved() ? { color: 'var(--p-500)', message: 'Page is not saved' } : undefined,
    }));
  });

  protected showId = signal<boolean>(false);

  selectedForm = linkedSignal<string[]>(() => {
    const translation = this.store.currentForm()?.label;
    if (translation) return [this.localeService.translate(translation)];
    return [];
  });
  selectedPage = linkedSignal<string[]>(() => {
    const translation = this.store.currentPage()?.label;
    if (translation) return [this.localeService.translate(translation)];
    return [];
  });
  protected selectedDivision = linkedSignal<string[]>(() => {
    const translation = this.store.currentDivision()?.label;
    if (translation) return [this.localeService.translate(translation)];
    return [];
  });

  protected formOptions = computed<OptionProps<Form>[]>(() => itemOptions<Form>(this.store.forms() ?? {}, this.localeService.translate));
  protected pageOptions = computed<OptionProps<Page>[]>(() => itemOptions<Page>(this.store.pages() ?? {}, this.localeService.translate));
  protected divisionOptions = computed<OptionProps<Division>[]>(() =>
    itemOptions<Division>(this.store.divisions() ?? {}, this.localeService.translate)
  );

  protected updateSelectedForm(event: string[]) {
    const selectedForm = this.formOptions().find(o => o.value && event.includes(o.value))?.data;
    if (selectedForm) this.store.currentForm.set(selectedForm);
  }
  protected updateSelectedPage(event: string[]) {
    const selectedPage = this.pageOptions().find(o => o.value && event.includes(o.value))?.data;
    if (selectedPage) this.store.currentPage.set(selectedPage);
  }
  protected updateSelectedDivision(event: string[]) {
    const selectedDivision = this.divisionOptions().find(o => o.value && event.includes(o.value))?.data;
    if (selectedDivision) this.store.currentDivision.set(selectedDivision);
  }

  protected setActive() {}
  protected listLabel(locale: Locale): (k: Pick<Entry, 'label'>) => string {
    return (k: Pick<Entry, 'label'>) => k.label[locale] ?? 'No translation';
  }
  protected add() {}

  protected save() {
    const entry = this.currentEntry();
    const keys: (keyof Entry)[] = ['id', 'type', 'label', 'updated', 'entrySpecific'];

    const missingKey = keys.filter(k => !entry || !entry[k]);
    if (missingKey.length) console.error(`${missingKey.join(', ')} missing`);
    else {
      this.apiService.post.entry(entry as Entry);
      this.localStorage.clear.entry();
    }
  }

  constructor() {}
}
