import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Option } from '@cs-forms/shared';
import { IconEnum } from 'src/helpers/enum';
import { ExtendedArray } from 'src/helpers/utils';
import { DropdownComponent, SelectorItem } from '../components/action/dropdown.component';
import { IconButtonComponent } from '../components/action/iconButton.component';
import { InputLayoutComponent } from '../components/action/input.layout.component';
import { TextFieldComponent } from '../components/action/textfield.component';
import { ContextMenuComponent } from '../components/modals/contextMenu.component';
import { LayoutComponent } from './common/layout.component';

@Component({
  selector: 'pages-page',
  imports: [
    IconButtonComponent,
    LayoutComponent,
    ContextMenuComponent,
    DropdownComponent,
    TextFieldComponent,
    ReactiveFormsModule,
    InputLayoutComponent,
  ],
  template: `<layout [contentTitle]="'Select a page'">
    <span content header>Page details</span>
    <span content header-options>
      <icon-button [class.can-save]="canSave()" [icon]="IconEnum.Save" (clicked)="save()" />
      <icon-button [icon]="IconEnum.Add" (clicked)="add()" />
      <context-menu [options]="pageHeaderOptions">
        <icon-button [icon]="IconEnum.Options" />
      </context-menu>
    </span>
    <span content location>
      <input-layout [label]="'Form'">
        <drop-down slim [items]="formOptions()" slim [formControl]="crtlGrp.controls.section" [multiSelect]="false" />
      </input-layout>
      <text-field slim [label]="'Search'" [prefixIcon]="IconEnum.Search" />
    </span>
    <span content list> </span>
  </layout>`,
  styles: `
    :host {
      display: flex;
      flex: 1;
    }
  `,
})
export class PagePageComponent {
  IconEnum = IconEnum;

  canSave = signal<boolean>(false);

  protectedcanSave = signal<boolean>(false);

  protected pageHeaderOptions: Option[] = [{ label: 'Change section name', value: 'changeName' }];
  protected formOptions = signal<ExtendedArray<SelectorItem>>(new ExtendedArray());

  protected crtlGrp = new FormGroup({
    section: new FormControl<ExtendedArray<string>>(new ExtendedArray()),
    page: new FormControl<ExtendedArray<string>>(new ExtendedArray()),
    form: new FormControl<ExtendedArray<string>>(new ExtendedArray()),
  });

  add() {}
  save() {}
}
