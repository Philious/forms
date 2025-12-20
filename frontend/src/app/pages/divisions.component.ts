import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Division, Form, Option, Page } from '@cs-forms/shared';
import { IconEnum, Locale } from '@src/helpers/enum';
import { newDivision } from '@src/helpers/form.utils';
import { Translation } from '@src/helpers/translationTypes';
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
  selector: 'division-page',
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
    AriaDropComponent,
  ],
  template: `
    <layout [contentTitle]="'Select a division'">
      <ng-content header>
        <span>Division details</span>
      </ng-content>
      <ng-content header-options>
        <span content header-options>
          <icon-button [class.can-save]="canSave()" [icon]="IconEnum.Save" (clicked)="save()" />
          <icon-button [icon]="IconEnum.Add" (clicked)="add()" />
          <context-menu [options]="divisionHeaderOptions">
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
        <list [(list)]="divisionList" [findLabelFn]="findLabel" (updateSelected)="this.currentDivision.set($event)" />
      </ng-content>
      <ng-content specifics>
        @let currentDivision = this.currentDivision();
        @if (currentDivision) {
          <div layout-section animate.enter="'enter'" animate.leave="'leave'">
            <h2 class="h2">Active Division</h2>
            <translation-input [translations]="currentDivision.header" (translationsChange)="updateHeader($event)" />
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
  addNewDialog = inject(AddNewDialogComponent);

  canSave = signal<boolean>(false);
  locale = computed<Locale>(() => this.localeService.activeLocale() ?? Locale.SV);
  currentDivision = this.store.currentDivision;

  divisionList = linkedSignal<Division[]>(() => {
    const division = this.store.divisions();
    return division ? Object.values(division) : [];
  });

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
        .filter(o => o.id === this.store.currentForm()?.id)
        ?.map(o => o.value) || []
    );
  });

  pageOptions = computed<OptionProps<Page>[]>(() =>
    (Object.values(this.store.pages() ?? {}) as Page[]).map(o => ({
      id: o.id,
      value: o.header?.['sv-SE'] ?? 'NO NAME',
      data: o,
    }))
  );
  selectedPage = linkedSignal<string[]>(() => {
    return (
      this.formOptions()
        .filter(o => o.id === this.store.currentPage()?.id)
        ?.map(o => o.value) || []
    );
  });

  protected divisionHeaderOptions: Option<string>[] = [{ label: 'Change division name', value: 'changeName' }];

  protected entryViewTabs = [
    { label: 'Tree', value: 'tree' },
    { label: 'List', value: 'list' },
  ];
  protected selectedEntryViewType = signal<'tree' | 'list'>('tree');
  findLabel = (division: Division): string => (division.header ? division.header[this.locale()] : 'No translation');

  add() {
    this.addNewDialog.open('Add new division', '', (header: Translation) => {
      if (header) {
        const division = newDivision({ header });
        this.divisionList.update(list => {
          // Needed to trigger the update, (spread is not deep)
          const newArr: Division[] = [];

          list.push(division);
          list.forEach(item => {
            newArr.push(item);
          });

          return newArr;
        });
        this.store.setDivision(division);
        return true;
      }
      return false;
    });
  }
  save() {
    const division = this.currentDivision();
    if (division) {
      this.apiService.post.division(division);
    }
  }
  protected updateSelectedForm(event: string[]) {
    console.log(this.store.currentForm());
    const selectedForm = this.formOptions().find(o => o.value && event.includes(o.value))?.data;
    if (selectedForm) this.store.setForm(selectedForm);
  }
  protected updateSelectedPage(event: string[]) {
    console.log(this.store.currentPage());
    const selectedPage = this.pageOptions().find(o => o.value && event.includes(o.value))?.data;
    if (selectedPage) this.store.setPage(selectedPage);
  }
  updateHeader(translation: Translation) {
    const trans = translation;
    this.currentDivision.update(division => {
      division!['header'] = trans;
      return division;
    });
  }
}
