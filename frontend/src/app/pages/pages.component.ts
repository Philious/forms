import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal, Signal, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Form, Page } from '@cs-forms/shared';
import { IconEnum, Locale } from '@src/helpers/enum';
import { itemOptions, newPage } from '@src/helpers/form.utils';
import { Translation } from '@src/helpers/translationTypes';
import { Option } from '@src/helpers/types';
import { AriaDropComponent, OptionProps } from '../components/action/aria-drop.component';
import { IconButtonComponent } from '../components/action/icon-button.component';
import { Validator } from '../components/action/input-layout/input.types';
import { TabViewComponent } from '../components/action/tab-view.component';
import { TextFieldComponent } from '../components/action/textfield.component';
import { TranslationInputComponent } from '../components/action/translation-input';
import { AddDialog } from '../components/modals/add.new.dialog.component';
import { BinaryDialog } from '../components/modals/binary.dialog.component';
import { ContextMenuComponent } from '../components/modals/contextMenu.component';
import { ListComponent, ListItem } from '../components/reorerableList.component';
import { ApiService } from '../services/api.service';
import { LocaleService } from '../services/locale.service';
import { LocalStorageService } from '../services/localStorageService';
import { Store } from '../store/store';
import { LayoutComponent } from './common/layout.component';
import { loadPageFn, mergeListItem, updateSelectedAriaOptionFn } from './common/page.utilities';

@Component({
  selector: 'pages-page',
  imports: [
    IconButtonComponent,
    LayoutComponent,
    ContextMenuComponent,
    TextFieldComponent,
    ReactiveFormsModule,
    TranslationInputComponent,
    TabViewComponent,
    ListComponent,
    CommonModule,
    AriaDropComponent,
  ],
  template: `
    <layout [contentTitle]="'Select a page'">
      <ng-content header>
        <span>Page details</span>
      </ng-content>
      <ng-content header-options>
        <span content header-options
          >{{ currentSaved() }}
          <icon-button [class.can-save]="!currentSaved()" [icon]="IconEnum.Save" (clicked)="save()" />
          <icon-button [icon]="IconEnum.Add" (clicked)="add()" />
          <context-menu [options]="pageLabelOptions">
            <icon-button [icon]="IconEnum.Options" />
          </context-menu>
        </span>
      </ng-content>
      <ng-content location>
        <aria-drop
          [items]="formOptions()"
          [selected]="selectedForm()"
          (selectedChange)="updateSelectedForm($event)"
          [validators]="formValidators()"
        />
        <text-field slim [label]="'Search'" [prefixIcon]="IconEnum.Search" />
      </ng-content>
      <ng-content list>
        <list [(list)]="filteredPageList" (selectedChange)="updateSelected($event)" />
      </ng-content>
      <ng-content specifics>
        @let currentPage = this.store.currentPage();
        @if (currentPage) {
          <div layout-section animate.enter="'enter'" animate.leave="'leave'">
            <h2 class="h2">Active Page</h2>
            <translation-input [translations]="currentPage.label" (translationsChange)="updateLabel($event)" />
          </div>
          <tab-view
            [tabs]="[
              { label: 'List', template: list },
              { label: 'Tree', template: tree },
            ]"
            [(selected)]="selectedEntryViewType"
          />
          <ng-template #list>
            <div layout-section animate.enter="'enter'" animate.leave="'leave'">
              <h2 class="h2">Divisions</h2>
            </div>
            <div layout-section animate.enter="'enter'" animate.leave="'leave'">
              <h2 class="h2">Entries</h2>
            </div>
          </ng-template>
          <ng-template #tree> Tree </ng-template>
        }
      </ng-content>
    </layout>
  `,
  styles: `
    :host {
      display: flex;
      flex: 1;
    }
    .can-save {
      color: var(--p-500);
    }
  `,
})
export class PagePageComponent {
  IconEnum = IconEnum;
  store = inject(Store);
  apiService = inject(ApiService);
  localeService = inject(LocaleService);
  localStorage = inject(LocalStorageService);
  binaryDialog = inject(BinaryDialog);
  addDialog = inject(AddDialog);

  protected currentSaved: Signal<boolean>;
  protected pageList: WritableSignal<ListItem[]>;
  protected filteredPageList = linkedSignal<ListItem[]>(() =>
    this.pageList().filter(p => !this.store.currentForm() || this.store.currentForm()?.pages.includes(p.id))
  );

  protected formOptions = computed<OptionProps<Form>[]>(() => itemOptions<Form>(this.store.forms() ?? {}, this.localeService.translate));
  protected selectedForm = linkedSignal<string[]>(() => {
    const id = this.store.currentForm()?.id;
    return id ? [id] : [];
  });
  protected formValidators = signal<Validator[]>([]);

  protected pageLabelOptions: Option<string>[] = [{ label: 'Change section name', value: 'changeName' }];
  protected selectedEntryViewType = signal<'tree' | 'list'>('tree');
  protected entryViewTabs = [
    { label: 'Tree', value: 'tree' },
    { label: 'List', value: 'list' },
  ];

  protected updateSelected: (id: string | null) => void;
  protected save: () => void;
  protected updateLabel: (translation: Translation) => void;

  protected updateSelectedForm = updateSelectedAriaOptionFn<Form>(this.formOptions, this.store.currentForm);

  protected async add() {
    this.localeService.set(Locale.XX);
    const formTranslation = this.store.currentForm()?.label.translationKey ?? '';
    const currentFormId = this.store.currentForm()?.id;

    if (!currentFormId) {
      this.formValidators.set([(val: string) => (val ? null : 'Select a form')]);
      return;
    }
    await this.addDialog
      .open({ title: 'Add new page', content: '', initialValue: formTranslation })
      .then(value => {
        const page = newPage({ label: value, forms: [currentFormId] });
        this.pageList.update(list => mergeListItem(list, page, this.localeService.translate));
        this.store.currentPage.set(page);

        const form = this.store.currentForm();
        if (form) {
          form.pages.push(page.id);
          this.store.currentForm.set(form);
          this.apiService.post.form(form);
        }
      })
      .catch(() => {});
  }

  constructor() {
    const { currentSaved, list, updateSelected, save, updateLabel } = loadPageFn<Page>(
      this.store.currentPage,
      this.store.pages,
      this.localeService.translate,
      this.store.storePage,
      this.apiService.post.page
    );

    this.currentSaved = currentSaved;
    this.pageList = list;
    this.updateSelected = updateSelected;
    this.save = save;
    this.updateLabel = updateLabel;

    // effect(() => console.log('page list: ', this.selectedForm()));
  }
}
