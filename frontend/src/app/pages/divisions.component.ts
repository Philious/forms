import { Component, computed, inject, linkedSignal, Signal, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Division, Form, Option, Page } from '@cs-forms/shared';
import { IconEnum, Locale } from '@src/helpers/enum';
import { itemOptions, newDivision } from '@src/helpers/form.utils';
import { Translation } from '@src/helpers/translationTypes';
import { AriaDropComponent, OptionProps } from '../components/action/aria-drop.component';
import { IconButtonComponent } from '../components/action/icon-button.component';
import { SignalInputLayoutComponent } from '../components/action/input-layout/signal-input.layout.component';
import { TabViewComponent } from '../components/action/tab-view.component';
import { TextFieldComponent } from '../components/action/textfield.component';
import { TranslationInputComponent } from '../components/action/translation-input';
import { AddNewDialogComponent, openAddNewDialog } from '../components/modals/add.new.dialog.component';
import { ContextMenuComponent } from '../components/modals/contextMenu.component';
import { ListComponent, ListItem } from '../components/reorerableList.component';
import { ApiService } from '../services/api.service';
import { LocaleService } from '../services/locale.service';
import { LocalStorageService } from '../services/localStorageService';
import { Store } from '../store/store';
import { LayoutComponent } from './common/layout.component';
import { loadPageFn, mergeListItem, updateSelectedAriaOptionFn } from './common/page.utilities';

@Component({
  selector: 'division-page',
  imports: [
    IconButtonComponent,
    LayoutComponent,
    ContextMenuComponent,
    TextFieldComponent,
    ReactiveFormsModule,
    TranslationInputComponent,
    ListComponent,
    TabViewComponent,
    SignalInputLayoutComponent,
    AriaDropComponent,
  ],
  template: `
    <layout [contentTitle]="'Select a division'">
      <ng-content header>
        <span>Division details</span>
      </ng-content>
      <ng-content header-options>
        <span content header-options>
          <icon-button [class.can-save]="!currentSaved()" [icon]="IconEnum.Save" (clicked)="save()" />
          <icon-button [icon]="IconEnum.Add" (clicked)="add()" />
          <context-menu [options]="divisionLabelOptions">
            <icon-button [icon]="IconEnum.Options" />
          </context-menu>
        </span>
      </ng-content>
      <ng-content location>
        <signal-input-layout [type]="'text'" slim [label]="'Form'" [sufix]="IconEnum.Down">
          <aria-drop [items]="formOptions()" [selected]="selectedForm()" (selectedChange)="updateSelectedForm($event)" />
        </signal-input-layout>
        <signal-input-layout [type]="'text'" slim [label]="'Page'" [sufix]="IconEnum.Down">
          <aria-drop [items]="pageOptions()" [selected]="selectedPage()" (selectedChange)="updateSelectedPage($event)" />
        </signal-input-layout>
        <text-field slim [label]="'Search'" [prefixIcon]="IconEnum.Search" />
      </ng-content>
      <ng-content list>
        <list [(list)]="divisionList" (selectedChange)="updateSelected($event)" />
      </ng-content>
      <ng-content specifics>
        @let currentDivision = this.store.currentDivision();
        @if (currentDivision) {
          <div layout-section animate.enter="'enter'" animate.leave="'leave'">
            <h2 class="h2">Active Division</h2>
            <translation-input [translations]="currentDivision.label" (translationsChange)="updateLabel($event)" />
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
export class DivisionPageComponent {
  IconEnum = IconEnum;
  store = inject(Store);
  apiService = inject(ApiService);
  localeService = inject(LocaleService);
  localStorage = inject(LocalStorageService);
  addNewDialog = inject(AddNewDialogComponent);

  protected currentSaved: Signal<boolean>;
  protected divisionList: WritableSignal<ListItem[]>;

  protected formOptions = computed<OptionProps<Form>[]>(() => itemOptions<Form>(this.store.forms() ?? {}, this.localeService.translate));
  protected selectedForm = linkedSignal<string[]>(() => {
    const id = this.store.currentForm()?.id;
    return id ? [id] : [];
  });
  protected pageOptions = computed<OptionProps<Page>[]>(() => itemOptions<Page>(this.store.pages() ?? {}, this.localeService.translate));
  protected selectedPage = linkedSignal<string[]>(() => {
    const translation = this.store.currentPage()?.label;
    return translation ? [this.localeService.translate(translation)] : [];
  });

  protected divisionLabelOptions: Option<string>[] = [{ label: 'Change division name', value: 'changeName' }];
  protected selectedEntryViewType = signal<'tree' | 'list'>('tree');
  protected entryViewTabs = [
    { label: 'Tree', value: 'tree' },
    { label: 'List', value: 'list' },
  ];

  protected updateSelected: (id: string | null) => void;
  protected save: () => void;
  protected updateLabel: (translation: Translation) => void;

  protected updateSelectedForm = updateSelectedAriaOptionFn<Form>(this.formOptions, this.store.currentForm);
  protected updateSelectedPage = updateSelectedAriaOptionFn<Page>(this.pageOptions, this.store.currentPage);

  async add() {
    this.localeService.set(Locale.XX);
    await openAddNewDialog('Add new division', '').then(value => {
      const division = newDivision({ label: value });
      this.divisionList.update(list => mergeListItem(list, division, this.localeService.translate));
      this.store.currentDivision.set(division);
    });
  }

  constructor() {
    console.log('create divisions component');
    const { currentSaved, list, updateSelected, save, updateLabel } = loadPageFn<Division>(
      this.store.currentDivision,
      this.store.divisions,
      this.localeService.translate,
      this.store.storeDivision,
      this.apiService.post.division
    );

    this.currentSaved = currentSaved;
    this.divisionList = list;
    this.updateSelected = updateSelected;
    this.save = save;
    this.updateLabel = updateLabel;
  }
}
