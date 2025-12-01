import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { IconEnum } from '@app/helpers/enum';
import { Option } from '@cs-forms/shared';
import { IconButtonComponent } from '../components/action/iconButton.component';
import { TextFieldComponent } from '../components/action/textfield.component';
import { ContextMenuComponent } from '../components/modals/contextMenu.component';
import { LayoutComponent } from './common/layout.component';

@Component({
  selector: 'forms-page',
  imports: [LayoutComponent, IconButtonComponent, ContextMenuComponent, TextFieldComponent, JsonPipe],
  template: `<layout [contentTitle]="'Select a form'">
    <span content header>Form details</span>
    <span content header-options>
      <icon-button [class.can-save]="canSave()" [icon]="IconEnum.Save" (clicked)="save()" />
      <icon-button [icon]="IconEnum.Add" (clicked)="add()" />
      <context-menu [options]="sectionOptions">
        <icon-button [icon]="IconEnum.Options" />
      </context-menu>
    </span>
    <span content location>
      <text-field slim [label]="'Search'" [prefixIcon]="IconEnum.Search" />
      {{ t().values() | json }}
    </span>
  </layout>`,
  styles: `
    :host {
      display: flex;
      flex: 1;
    }
  `,
})
export class SectionPageComponent {
  IconEnum = IconEnum;

  canSave = signal<boolean>(false);

  sectionOptions: Option[] = [{ label: 'Change section name', value: 'changeName' }];

  add() {}
  save() {}
  t = signal(new Map([['entry', 6]]));
  constructor() {
    setTimeout(
      () =>
        this.t.update(o => {
          o.set('asd', 8);
          return o;
        }),
      2000
    );
  }
}
