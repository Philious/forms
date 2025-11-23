import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Entry, Option } from '@cs-forms/shared';
import { DropdownComponent, SelectorItem } from 'src/app/components/action/dropdown.component';
import { IconButtonComponent } from 'src/app/components/action/iconButton.component';
import { InputLayoutComponent } from 'src/app/components/action/input-layout/input.layout.component';
import { SwitchComponent } from 'src/app/components/action/switch.component';
import { TextFieldComponent } from 'src/app/components/action/textfield.component';
import { ContextMenuComponent } from 'src/app/components/modals/contextMenu.component';
import { ListComponent } from 'src/app/components/reorerableList.component';
import { ApiService } from 'src/app/services/api.service';
import { Store } from 'src/app/store/store';
import { IconEnum } from 'src/helpers/enum';
import { newEntry } from 'src/helpers/form.utils';
import { LayoutComponent } from '../common/layout.component';
import { ActiveEntryComponent } from './activeEntry/activeEntry.component';

@Component({
  selector: 'entries-page',
  imports: [
    LayoutComponent,
    IconButtonComponent,
    ContextMenuComponent,
    DropdownComponent,
    TextFieldComponent,
    CommonModule,
    ActiveEntryComponent,
    SwitchComponent,
    ListComponent,
    InputLayoutComponent,
    ReactiveFormsModule,
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
      <input-layout slim [label]="'Form'" [sufix]="IconEnum.Down" [control]="crtlGrp.controls.section">
        <drop-down [items]="formOptions" slim [formControl]="crtlGrp.controls.section" [multiSelect]="false" />
      </input-layout>
      <input-layout slim [label]="'Page'" [sufix]="IconEnum.Down" [control]="crtlGrp.controls.section">
        <drop-down [items]="pageOptions" slim [formControl]="crtlGrp.controls.section" [multiSelect]="false" />
      </input-layout>
      <input-layout slim [label]="'Section'" [sufix]="IconEnum.Down" [control]="crtlGrp.controls.section">
        <drop-down [items]="sectionOptions" slim [formControl]="crtlGrp.controls.section" [multiSelect]="false" />
      </input-layout>
      <text-field slim [label]="'Search'" [prefixIcon]="IconEnum.Search" />
      <switch slim [(active)]="showId" [label]="'Show id'" />
    </span>
    <span list>
      <list [(list)]="entryList" [displayKey]="showId() ? 'id' : 'label'" (updateSelected)="this.currentEntry.set($event)" />
    </span>
    <span specifics>
      <active-entry [entry]="currentEntry()" />
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
  store = inject(Store);
  IconEnum = IconEnum;

  currentEntry = this.store.currentEntry;

  canSave = signal<boolean>(false);

  formOptions: SelectorItem[] = [];
  pageOptions: SelectorItem[] = [];
  sectionOptions: SelectorItem[] = [];
  crtlGrp = new FormGroup({
    section: new FormControl<SelectorItem[]>([]),
    page: new FormControl<SelectorItem[]>([]),
    form: new FormControl<SelectorItem[]>([]),
  });

  entryList = linkedSignal<Entry[]>(() => {
    const entries = this.store.entries();
    return entries ? Object.values(entries) : [];
  });

  protected entryOrder = computed(() => this.entryList().map(e => e.id));
  protected pageHeaderOptions: Option[] = [{ label: 'Change section name', value: 'changeName' }];
  protected sectionList = [{ label: 'Change section name', value: 'changeName' }];

  protected add() {
    const count = this.entryList().length + 1;
    const entry = newEntry({ id: `entry${count}`, label: `Entry ${count}` });

    this.entryList.update(list => {
      list.push(entry);
      return list;
    });
  }

  protected save() {
    const entry = this.currentEntry();

    if (entry) this.apiService.post.entry(entry);
  }

  protected showId = signal<boolean>(false);
  constructor() {}
}
