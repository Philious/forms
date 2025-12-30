import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { Form } from '@cs-forms/shared';
import { TabViewComponent } from '@src/app/components/action/tab-view.component';
import { TranslationInputComponent } from '@src/app/components/action/translation-input';
import { openAddNewDialog } from '@src/app/components/modals/add.new.dialog.component';
import { ApiService } from '@src/app/services/api.service';
import { LocaleService } from '@src/app/services/locale.service';
import { IconEnum, Locale } from '@src/helpers/enum';
import { newForm } from '@src/helpers/form.utils';
import { Translation } from '@src/helpers/translationTypes';
import { Option } from '@src/helpers/types';
import { IconButtonComponent } from '../components/action/icon-button.component';
import { TextFieldComponent } from '../components/action/textfield.component';
import { openBinaryDialog } from '../components/modals/binary.dialog.component';
import { ContextMenuComponent } from '../components/modals/contextMenu.component';
import { ListComponent, ListItem } from '../components/reorerableList.component';
import { LocalStorageService } from '../services/localStorageService';
import { Store } from '../store/store';
import { LayoutComponent } from './common/layout.component';
import { loadPageFn, mergeListItem } from './common/page.utilities';

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

      <span content header-options>
        <icon-button [class.can-save]="!currentSaved()" [icon]="IconEnum.Save" (clicked)="save()" />
        <icon-button [icon]="IconEnum.Add" (clicked)="add()" />
        <context-menu [options]="pageLabelOptions">
          <icon-button [icon]="IconEnum.Options" />
        </context-menu>
      </span>

      <ng-content location>
        <text-field slim [label]="'Search'" [prefixIcon]="IconEnum.Search" />
      </ng-content>
      <ng-content list>
        <list [(list)]="formList" (selectedChange)="updateSelected($event)" (removeId)="removeItem($event)" />
      </ng-content>
      <ng-content specifics>
        @let currentForm = this.store.currentForm();
        @if (currentForm) {
          <div layout-section animate.enter="'enter'" animate.leave="'leave'">
            <h2 class="h2">Active form</h2>
            <translation-input [translations]="currentForm.label" (translationsChange)="updateLabel($event)" />
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
    .h2 {
      white-space: nowrap;
      width: min-content;
    }
    .can-save {
      color: var(--p-500);
    }
  `,
})
export class FormPageComponent {
  IconEnum = IconEnum;
  store = inject(Store);
  apiService = inject(ApiService);
  localeService = inject(LocaleService);
  localStorage = inject(LocalStorageService);
  dialog = inject(Dialog);

  protected currentSaved: Signal<boolean>;
  protected formList: WritableSignal<ListItem[]>;

  protected pageLabelOptions: Option<string>[] = [{ label: 'Change section name', value: 'changeName' }];

  protected entryViewTabs = [
    { label: 'Tree', value: 'tree' },
    { label: 'List', value: 'list' },
  ];

  protected selectedEntryViewType = signal<'tree' | 'list'>('tree');

  protected updateSelected: (id: string | null) => void;
  protected save: () => void;
  protected updateLabel: (translation: Translation) => void;

  protected async add() {
    this.localeService.set(Locale.XX);
    await openAddNewDialog('Add new form', '').then(value => {
      const form = newForm({ label: value });
      this.formList.update(list => mergeListItem(list, form, this.localeService.translate));
      this.store.currentForm.set(form);
    });
  }

  protected async removeItem(id: string) {
    await openBinaryDialog('Remove form?', 'This can not be undone')
      .then(() => console.log('remove' + id))
      .catch(() => console.log('do not remove' + id));
  }

  constructor() {
    const { currentSaved, list, updateSelected, save, updateLabel } = loadPageFn<Form>(
      this.store.currentForm,
      this.store.forms,
      this.localeService.translate,
      this.store.storeForm,
      this.apiService.post.form
    );

    this.currentSaved = currentSaved;
    this.formList = list;
    this.updateSelected = updateSelected;
    this.save = save;
    this.updateLabel = updateLabel;

    // effect(() => console.log('current form: ', this.store.currentForm()));
  }
}
