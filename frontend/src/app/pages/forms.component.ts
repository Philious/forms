import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { Form, Option } from '@cs-forms/shared';
import { TabViewComponent } from '@src/app/components/action/tab-view.component';
import { TranslationInputComponent } from '@src/app/components/action/translation-input';
import { AddNewDialogComponent } from '@src/app/components/modals/add.new.dialog.component';
import { ApiService } from '@src/app/services/api.service';
import { LocaleService } from '@src/app/services/locale.service';
import { IconEnum, Locale } from '@src/helpers/enum';
import { newForm } from '@src/helpers/form.utils';
import { Translation } from '@src/helpers/translationTypes';
import { IconButtonComponent } from '../components/action/icon-button.component';
import { TextFieldComponent } from '../components/action/textfield.component';
import { ContextMenuComponent } from '../components/modals/contextMenu.component';
import { ListComponent } from '../components/reorerableList.component';
import { Store } from '../store/store';
import { LayoutComponent } from './common/layout.component';

@Component({
  selector: 'forms-page',
  imports: [
    LayoutComponent,
    IconButtonComponent,
    ContextMenuComponent,
    TextFieldComponent,
    ListComponent,
    CommonModule,
    TranslationInputComponent,
    TabViewComponent,
  ],
  template: `
    <layout [contentTitle]="'Select a form'">
      <ng-content header>
        <span>Form details</span>
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
        <text-field slim [label]="'Search'" [prefixIcon]="IconEnum.Search" />
      </ng-content>
      <ng-content list>
        <list [(list)]="formList" [findLabelFn]="findLabel" (updateSelected)="this.currentForm.set($event)" />
      </ng-content>
      <ng-content specifics>
        @let currentForm = this.currentForm();
        @if (currentForm) {
          <div layout-section animate.enter="'enter'" animate.leave="'leave'">
            <h2 class="h2">Active form</h2>
            <translation-input [translations]="currentForm.header" (translationsChange)="updateHeader($event)" />
          </div>
          <div layout-section animate.enter="'enter'" animate.leave="'leave'">
            <h2 class="h2">Pages</h2>
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
export class FormPageComponent {
  IconEnum = IconEnum;
  store = inject(Store);
  apiService = inject(ApiService);
  localeService = inject(LocaleService);
  addNewDialog = inject(AddNewDialogComponent);

  canSave = signal<boolean>(false);
  locale = computed<Locale>(() => this.localeService.activeLocale() ?? Locale.SV);
  currentForm = this.store.currentForm;

  formList = linkedSignal<Form[]>(() => {
    const forms = this.store.forms();
    return forms ? Object.values(forms) : [];
  });

  protected pageHeaderOptions: Option<string>[] = [{ label: 'Change section name', value: 'changeName' }];

  protected entryViewTabs = [
    { label: 'Tree', value: 'tree' },
    { label: 'List', value: 'list' },
  ];
  protected selectedEntryViewType = signal<'tree' | 'list'>('tree');
  findLabel = (form: Form): string => (form.header ? form.header[this.locale()] : 'No translation');

  add() {
    this.addNewDialog.open('Add new form', '', (header: Translation) => {
      if (header) {
        const form = newForm({ header });
        this.formList.update(list => {
          // Needed to trigger the update, (spread is not deep)
          const newArr: Form[] = [];

          list.push(form);
          list.forEach(item => {
            newArr.push(item);
          });

          return newArr;
        });
        this.store.setForm(form);
        return true;
      }
      return false;
    });
  }

  save() {
    const form = this.currentForm();
    if (form) {
      this.apiService.post.form(form);
    }
  }

  updateHeader(translation: Translation) {
    const trans = translation;
    this.currentForm.update(form => {
      form!['header'] = trans;
      return form;
    });
  }

  constructor() {}
}
