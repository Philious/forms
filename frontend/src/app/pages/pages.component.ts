import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Form, Page } from '@cs-forms/shared';
import { IconEnum, Locale } from '@src/helpers/enum';
import { newPage } from '@src/helpers/form.utils';
import { Translation } from '@src/helpers/translationTypes';
import { Option as ContextMenuOption } from '@src/helpers/types';
import { AriaDropComponent, OptionProps } from '../components/action/aria-drop.component';
import { IconButtonComponent } from '../components/action/icon-button.component';
import { SignalInputLayoutComponent } from '../components/action/input-layout/signal-input.layout.component';
import { TabViewComponent } from '../components/action/tab-view.component';
import { TextFieldComponent } from '../components/action/textfield.component';
import { TranslationInputComponent } from '../components/action/translation-input';
import { AddNewDialogComponent } from '../components/modals/add.new.dialog.component';
import { ContextMenuComponent } from '../components/modals/contextMenu.component';
import { ListComponent } from '../components/reorerableList.component';
import { ApiService } from '../services/api.service';
import { LocaleService } from '../services/locale.service';
import { Store } from '../store/store';
import { LayoutComponent } from './common/layout.component';

@Component({
  selector: 'pages-page',
  imports: [
    IconButtonComponent,
    LayoutComponent,
    ContextMenuComponent,
    TextFieldComponent,
    ReactiveFormsModule,
    ListComponent,
    TranslationInputComponent,
    TabViewComponent,
    SignalInputLayoutComponent,
    CommonModule,
    AriaDropComponent,
  ],
  template: `
    <layout [contentTitle]="'Select a page'">
      <ng-content header>
        <span>Page details</span>
      </ng-content>
      <ng-content header-options>
        <span content header-options>
          <icon-button [class.can-save]="canSave()" [icon]="IconEnum.Save" (clicked)="save()" />
          <icon-button [icon]="IconEnum.Add" (clicked)="add()" />
          <context-menu [options]="pageHeaderOptions">
            <icon-button [icon]="IconEnum.Options" />
          </context-menu>
        </span>
      </ng-content>
      <ng-content location>
        <signal-input-layout [type]="'text'" slim [label]="'Form'" [sufix]="IconEnum.Down">
          <aria-drop [items]="formOptions()" [selected]="selectedForm()" (selectedChange)="updateSelectedForm($event)" />
        </signal-input-layout>

        <text-field slim [label]="'Search'" [prefixIcon]="IconEnum.Search" />
      </ng-content>
      <ng-content list>
        <list [(list)]="pageList" [findLabelFn]="findLabelFn" (updateSelected)="this.currentPage.set($event)" />
      </ng-content>
      <ng-content specifics>
        @let currentPage = this.currentPage();
        @if (currentPage) {
          <div layout-section animate.enter="'enter'" animate.leave="'leave'">
            <h2 class="h2">Active Page</h2>
            <translation-input [translations]="currentPage.header" (translationsChange)="updateHeader($event)" />
          </div>
          <div layout-section animate.enter="'enter'" animate.leave="'leave'">
            <h2 class="h2">Divisions</h2>
          </div>
          <div layout-section animate.enter="'enter'" animate.leave="'leave'">
            <h2 class="h2">Entries</h2>
            <tab-view [tabs]="entryViewTabs" [(selected)]="selectedEntryViewType" />
          </div>
        }
      </ng-content>
    </layout>
  `,
  styles: `
    :host {
      display: flex;
      flex: 1;
    }
  `,
})
export class PagePageComponent {
  IconEnum = IconEnum;
  store = inject(Store);
  apiService = inject(ApiService);
  localeService = inject(LocaleService);
  addNewDialog = inject(AddNewDialogComponent);

  canSave = signal<boolean>(false);
  locale = computed<Locale>(() => this.localeService.activeLocale() ?? Locale.SV);
  currentForm = this.store.currentForm;
  currentPage = this.store.currentPage;

  formOptions = computed<OptionProps<Form>[]>(() =>
    (Object.values(this.store.forms() ?? {}) as Form[]).map(o => ({
      id: o.id,
      value: o.header?.['sv-SE'] ?? 'NO NAME',
      data: o,
    }))
  );
  selectedForm = linkedSignal<string[]>(() => {
    return (
      this.formOptions()
        .filter(o => o.id === this.currentForm()?.id)
        ?.map(o => o.value) || []
    );
  });

  pageList = linkedSignal<Page[]>(() => {
    const page = this.store.pages();
    return page ? Object.values(page) : [];
  });

  protected pageHeaderOptions: ContextMenuOption<string>[] = [{ label: 'Change section name', value: 'changeName' }];

  protected entryViewTabs = [
    { label: 'Tree', value: 'tree' },
    { label: 'List', value: 'list' },
  ];
  protected selectedEntryViewType = signal<'tree' | 'list'>('tree');

  protected updateSelectedForm(event: string[]) {
    const selectedForm = this.formOptions().find(o => o.value && event.includes(o.value))?.data;
    if (selectedForm) this.store.setForm(selectedForm);
  }

  findLabelFn = (page: Page): string => (page.header ? page.header[this.locale()] : 'No translation');

  add() {
    this.addNewDialog.open('Add new page', '', (header: Translation) => {
      if (header) {
        const page = newPage({ header });
        this.pageList.update(list => {
          // Needed to trigger the update, (spread is not deep)
          const newArr: Page[] = [];

          list.push(page);
          list.forEach(item => {
            newArr.push(item);
          });

          return newArr;
        });
        this.store.setPage(page);
        return true;
      }
      return false;
    });
  }
  save() {
    const page = this.currentPage();
    if (page) {
      this.apiService.post.page(page);
    }
  }

  updateHeader(translation: Translation) {
    const trans = translation;
    this.currentPage.update(page => {
      page!['header'] = trans;
      return page;
    });
  }

  constructor() {
    console.log('Pages');
  }
}
