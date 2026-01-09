import { Component, computed, inject, linkedSignal, Signal, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Division, Form, Option, Page } from '@cs-forms/shared';
import { IconEnum, Locale } from '@src/helpers/enum';
import { itemOptions, newDivision } from '@src/helpers/form.utils';
import { Translation } from '@src/helpers/translationTypes';
import { AriaDropComponent, OptionProps } from '../components/action/aria-drop.component';
import { IconButtonComponent } from '../components/action/icon-button.component';
import { TabViewComponent } from '../components/action/tab-view.component';
import { TextFieldComponent } from '../components/action/textfield.component';
import { TranslationInputComponent } from '../components/action/translation-input';
import { AddDialog } from '../components/modals/add.new.dialog.component';
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
        <aria-drop [items]="formOptions()" [label]="'Form'" [selected]="selectedForm()" (selectedChange)="updateSelectedForm($event)" />
        <aria-drop [items]="pageOptions()" [label]="'Page'" [selected]="selectedPage()" (selectedChange)="updateSelectedPage($event)" />
        <text-field slim [label]="'Search'" [prefixIcon]="IconEnum.Search" />
      </ng-content>
      <ng-content list>
        <list [(list)]="filteredDivisionList" (selectedChange)="updateSelected($event)" />
      </ng-content>
      <ng-content specifics>
        @let currentDivision = this.store.currentDivision();
        @if (currentDivision) {
          <div layout-section animate.enter="'enter'" animate.leave="'leave'">
            <h2 class="h2">Active Division</h2>
            <translation-input [translations]="currentDivision.label" (translationsChange)="updateLabel($event)" />
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
              <h2 class="h2">Entries</h2>
            </div>
          </ng-template>
          <ng-template #tree></ng-template>
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
export class DivisionPageComponent {
  IconEnum = IconEnum;
  store = inject(Store);
  apiService = inject(ApiService);
  localeService = inject(LocaleService);
  localStorage = inject(LocalStorageService);
  addDialog = inject(AddDialog);

  protected currentSaved: Signal<boolean>;
  protected divisionList: WritableSignal<ListItem[]>;
  protected filteredDivisionList = linkedSignal<ListItem[]>(() =>
    this.divisionList()
      .filter(p => !this.store.currentForm() || this.store.currentForm()?.divisions.includes(p.id))
      .filter(p => !this.store.currentPage() || this.store.currentPage()?.divisions.includes(p.id))
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
    const pageTranslationKey = this.store.currentPage()?.label.translationKey || '';
    const currentFormId = this.store.currentForm()?.id;
    const currentPageId = this.store.currentPage()?.id;
    if (!currentFormId || !currentPageId) return;

    await this.addDialog
      .open({ title: 'Add new division', content: '', initialValue: pageTranslationKey + '.' })
      .then(value => {
        const division = newDivision({ label: value, forms: [currentFormId], pages: [currentPageId] });
        console.log(division);
        this.divisionList.update(list => mergeListItem(list, division, this.localeService.translate));
        this.store.currentDivision.set(division);

        const form = this.store.currentForm();
        if (form) {
          form.divisions.push(division.id);
          this.store.currentForm.set(form);
          this.apiService.post.form(form);
        }

        const page = this.store.currentPage();
        if (page) {
          page.divisions.push(division.id);
          this.store.currentPage.set(page);
          this.apiService.post.page(page);
        }
      })
      .catch(() => {});
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
    console.log('All divs: ', list());
  }
}
